from confluent_kafka import Consumer, KafkaError, KafkaException, Producer
from app import TweetsClassifier
from hdfs_utils import append_to_hdfs_file,load_old_messages

consumer_conf = {'bootstrap.servers': 'localhost:9092',
                 'group.id': 'foo',
                 'auto.offset.reset': 'smallest'}


producer_conf = {'bootstrap.servers': 'localhost:9092'}

path_to_hdfs_file = "/feedback/comments.txt"

producer_conf = {'bootstrap.servers': 'localhost:9092'}

producer = Producer(producer_conf)

newConnectionConsumer = Consumer(consumer_conf)
newFeedbackConsumer = Consumer(consumer_conf)

producer = Producer(producer_conf)

newFeedbackTopics = ["newFeedbacks"]

classifier = TweetsClassifier()


def subscribe_to_newFeedback(consumer, topics):
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
                c = classifier.classify(
                    [msg.value().decode('utf-8')])
                new_data = f"{msg.value().decode('utf-8')}#$_!,{c[0]}\n"
                append_to_hdfs_file(path_to_hdfs_file, new_data)
                print(f"NEW MESSAGE : {msg.value().decode('utf-8')} : {c}")
                consumer.commit()
    finally:
        # Close down consumer to commit final offsets.
        consumer.close()



load_old_messages(producer,path_to_hdfs_file)
subscribe_to_newFeedback(newFeedbackConsumer, newFeedbackTopics)
