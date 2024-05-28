import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Kafka,Producer, Consumer } from 'kafkajs';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  kafka: Kafka;
  producer: Producer;
  consumer: Consumer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'feedback',
      brokers: ['localhost:9092'],
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'test-group' });

    this.initKafka();
  }

  async initKafka() {
    await this.producer.connect();
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'oldFeedbacks', fromBeginning: false });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          topic,
          partition,
          value: message.value.toString(),
        });
        this.server.emit('messages', message.value.toString());
      },
    });
  }

  @SubscribeMessage('newmassage')
  async newMassage(@MessageBody() data: any) {
    this.server.emit('newmassage', data);

    await this.producer.send({
      topic: 'newFeedbacks',
      messages: [{ value: data.toString() }],
    });
    await this.getComments();
  }

  async handleConnection(client: any) {
    console.log('\n\nClient connected:', client.id);
    await this.getComments();
  }

  getComments(){
    this.producer.send({
      topic: 'newConnection',
      messages: [{ value: '' }],
    });

  }
  handleDisconnect(client: any) {
    console.log('\n\nClient disconnected:', client.id);
  }
}
