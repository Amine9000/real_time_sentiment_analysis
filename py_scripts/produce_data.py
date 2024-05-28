from confluent_kafka import Consumer, KafkaError, KafkaException, Producer
from app import TweetsClassifier
from hdfs_utils import load_old_messages

consumer_conf = {'bootstrap.servers': 'localhost:9092',
                 'group.id': 'foo',
                 'auto.offset.reset': 'smallest'}


producer_conf = {'bootstrap.servers': 'localhost:9092'}

path_to_hdfs_file = "/feedback/comments.txt"

producer_conf = {'bootstrap.servers': 'localhost:9092'}

producer = Producer(producer_conf)

newConnectionConsumer = Consumer(consumer_conf)

newConnectionTopics = ["newConnection"]


def subscribe_to_newConnection(consumer,producer, topics,hdfs_path):
    try:
        consumer.subscribe(topics)

        while True:
            msg = consumer.poll(timeout=1.0)
            if msg is None:
                continue

            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    # End of partition event
                    sys.stderr.write('%% %s [%d] reached end at offset %d\n' %
                                     (msg.topic(), msg.partition(), msg.offset()))
                elif msg.error():
                    raise KafkaException(msg.error())
            else:
                load_old_messages(producer,hdfs_path)
                consumer.commit()
    finally:
        # Close down consumer to commit final offsets.
        consumer.close()

subscribe_to_newConnection(newConnectionConsumer,producer ,newConnectionTopics,path_to_hdfs_file)
