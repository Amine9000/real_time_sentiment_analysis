import pydoop.hdfs as hdfs
import json


def append_to_hdfs_file(hdfs_path, new_data, tmp_path="/tmp/tmp_hdfs_file"):
    # Step 1: Read the existing content from the HDFS file
    if hdfs.path.exists(hdfs_path):
        with hdfs.open(hdfs_path, 'rt') as hdfs_file:
            existing_content = hdfs_file.read()
    else:
        existing_content = ""

    # Step 2: Combine existing content with the new data
    combined_content = existing_content + new_data

    # Step 3: Write the combined content back to a temporary file in HDFS
    with hdfs.open(tmp_path, 'wt') as tmp_hdfs_file:
        tmp_hdfs_file.write(combined_content)

    # Step 4: Move the temporary file to the original HDFS file path
    hdfs.move(tmp_path, hdfs_path)


def read_hdfs_file(hdfs_path):
    if hdfs.path.exists(hdfs_path):
        with hdfs.open(hdfs_path, 'rt') as hdfs_file:
            content = hdfs_file.read()
        return content
    else:
        print(f"File {hdfs_path} does not exist.")
        return None


def load_old_messages(producer, hdfs_path):
    if hdfs.path.exists(hdfs_path):
        content = read_hdfs_file(
            hdfs_path).split("\n")
        print(content)
        content = [{"comment":part.split("#$_!,")[0],"value":part.split("#$_!,")[1]}
                   for part in content if part.split("#$_!,")[0]]
        producer.produce("oldFeedbacks", json.dumps(content))
        producer.flush()
        # for msg in content:
        #     print("\t>> SENDING MESSAGE : ",msg)
        #     try:
        #         producer.produce("oldFeedbacks", msg)
        #         producer.flush()
        #     except Exception as e:
        #         print(f"Failed to send message to Kafka: {e}")


if __name__ == "__main__":
    # Example usage
    hdfs_path = "/user/hadoop/myfile.txt"
    new_data = "\nThis is the new data to append."

    append_to_hdfs_file(hdfs_path, new_data)
