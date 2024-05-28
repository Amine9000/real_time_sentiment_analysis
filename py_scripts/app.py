import pandas as pd
import numpy as np
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn import svm, metrics
nltk.download('stopwords')
pd.options.mode.chained_assignment = None

file_path = "./archive/tweets.csv"



class TweetsClassifier:
    # body of the constructor
    def __init__(self):
        self.__load_data()  # read the dataset and delete the stopping words from it
        # split the dataset to training and testing, then use the training data to train the SVM model
        self.__train_model()
        # use the testing dataset to evaluate the model and print its accuracy
        self.__evaluate_mode()

    def __load_data(self):
        column_names = ["target", "ids", "date", "flag", "user", "text"]
        self.dataset = pd.read_csv(file_path,
                                   header=None,
                                   encoding='ISO-8859-1',
                                   names=column_names,
                                   skiprows=795000,
                                   nrows=10000)
        df = self.dataset[['text', 'target']]
        df['target'] = df['target'].replace(4, 1)
        self.corpus = []
        for i in range(0, int(df.shape[0])):
            text = re.sub('[^a-zA-z]', ' ', df['text'][i])
            text = text.lower()
            text = text.split()
            ps = PorterStemmer()
            all_stopwords = stopwords.words('english')
            all_stopwords.remove('not')
            text = [ps.stem(word)
                    for word in text if not word in set(all_stopwords)]
            text = ' '.join(text)
            self.corpus.append(text)
        self.target = df['target']
        pass

    def __train_model(self):
        self.x_train, self.x_test, self.y_train, self.y_test = train_test_split(
            self.corpus, self.target)

        self.Tfidf_Vectorizer = TfidfVectorizer(
            use_idf=True, stop_words='english')
        tfs_training = self.Tfidf_Vectorizer.fit_transform(
            self.x_train).astype('float64')

        # Create a svm Classifier
        self.svm_classifier = svm.SVC(kernel='linear')  # Linear Kernel

        # Train the model using the training sets
        self.svm_classifier.fit(tfs_training, self.y_train)
        pass

    def __evaluate_mode(self):
        # Predict the response for test dataset
        tfs_testing = np.asarray(self.Tfidf_Vectorizer.transform(
            self.x_test).astype('float64').todense())
        self.y_predected = self.svm_classifier.predict(tfs_testing)
        self.accuracy_score = metrics.accuracy_score(
            self.y_test, self.y_predected)
        pass

    def classify(self, list_of_tweets_text):
        tweets_vectors = self.Tfidf_Vectorizer.transform(
            list_of_tweets_text).astype('float64')

        return self.svm_classifier.predict(tweets_vectors)


# %%
# classifier = TweetsClassifier()  # build the classifier model and print its Accuracy
# # test the classifier
# print(classifier.classify(
#     ["iam so sad", "Hello, Its a good day", "what a bad day"]))
