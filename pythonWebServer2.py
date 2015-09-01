import os.path

import tornado.ioloop
import tornado.httpserver
import tornado.options
import tornado.web

import multiprocessing
import time

from nltk.corpus import wordnet as wn
#from nltk.corpus import wordnet_ic
from nltk.corpus import stopwords, words
from itertools import product
from nltk import FreqDist
from sklearn.decomposition import TruncatedSVD
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.preprocessing import Normalizer
from sklearn import metrics
from sklearn.cluster import KMeans, MiniBatchKMeans
#import pickle
import nltk
import json
import urllib2
import urllib
import re
import csv
import sklearn
import numpy
import signal
from scipy.stats.stats import pearsonr

from tornado.options import define, options
define("port", default=8335, type=int)

def css_files(self):
    return "style.css"

stopwords = nltk.corpus.stopwords.words('english')
words = nltk.corpus.words.words()
allData=object;

class DataPoint:
    def __init__(self):
        self.P1Dat = ""
        self.P2Dat = ""
        self.M1Dat = ""
        self.M2Dat = ""

        self.counts = []
        self.freqs = []
        
        self.freqP1 = {}
        self.freqP2 = {}
        self.freqM1 = {}
        self.freqM2 = {}
        
class Data:

    def __init__(self):
        self.count = 0;
        self.instances = list();
        
    def setNewData(self):
        dp = DataPoint()
        self.instances.append(dp)
        
        


    
ngDist = 0
FreqA = []
d=3


def signal_handler(signum, frame):
    print(signum)
    tornado.ioloop.IOLoop.instance().stop()

signal.signal(signal.SIGINT, signal_handler)


class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('page.html')


def pageGrab(url, whichList, A, idN, initialized, self):
    accepted = False
    try:
        if 'http://www.youtube.com' not in url:
            page = urllib2.urlopen(url).read()
            accepted = True
        #return page, True
    except:
        print('not accepted')
        accepted = False
        
    if(accepted==True):     
            
        print('accepted')
        accepted = True
        
        #cleanup
        page = nltk.clean_html(page)
        page = re.sub('[;:.,`\"\'-]','',page)
        
        #tokenize
        page = nltk.word_tokenize(page)


        
        #GRAB CO-OCCURING WORDS

        #find indexes of A
        indexList = []
        i = 0
        try:
            while True:
                i = page.index(A, i)
                indexList.append(i)
                i = i+1;
        except:
            pass

        
        #distance to target
        distanceFromTarget = d

        #for co-occuring tokens
        pageTokens=[]
        try:
            for index in indexList:

                #beginning of text
                if index < distanceFromTarget:
                    #beginning of text
                    pageTokens.append(page[:(index+distanceFromTarget)])
                if (index + distanceFromTarget) >= len(page):
                    #end of text
                    pageTokens.append(page[(index-distanceFromTarget):index])
                else:
                    #everywhere else
                    pageTokens.append(page[(index-distanceFromTarget):(index+distanceFromTarget)])
        except:
            pass

        #combine back into string
        returnString = ""
        if pageTokens != []:
            print(pageTokens)
            for tokens in pageTokens:
                for token in tokens:
                    if isinstance(token, str):
                        token = token.lower()
                        if token in words:
                            if token not in stopwords:
                                returnString = returnString + " " + token;

        
        print("id: "+str(idN))
        if(whichList == "P1"):
            allData.instances[idN].P1Dat = allData.instances[idN].P1Dat + " " + returnString;
        if(whichList == "P2"):
            allData.instances[idN].P2Dat = allData.instances[idN].P2Dat + " " + returnString;
        if(whichList == "M1"):
            allData.instances[idN].M1Dat = allData.instances[idN].M1Dat + " " + returnString;
        if(whichList == "M2"):
            allData.instances[idN].M2Dat = allData.instances[idN].M2Dat + " " + returnString;
            
        
        returnPacket = {'texts':returnString,'which':whichList, 'idNum':idN, 'initialized':initialized}
        self.write(returnPacket)
        self.finish()
        
    else:
        print('failed')
        returnPacket = {'texts':"",'which':"fail", 'idNum':idN, 'initialized':initialized }
        self.write(returnPacket)
        self.finish()

class WebSiteGrabberHandler(tornado.web.RequestHandler):
    def post(self):

        #on first grab establishes a new Dataset for the user, and the id to return

        dataInitialized = self.get_argument('dataInitialized')
        print("initialized: "+ str(dataInitialized))
        print(type(dataInitialized))

        if dataInitialized == "false":
            idN = allData.count;
            allData.setNewData();
            dataInitialized = True;
            allData.count = allData.count + 1
            print("numInstances " + str(len(allData.instances)))
        else:
            idN = self.get_argument('idNum');
            idN= int(idN)
            
        #grab url, convert from unicode to string
        url = self.get_argument('texts')
        
        url=str(url)
        print("URL = "+url);

        #which list (P1,P2,M1,M2?)
        whichList = self.get_argument('which')

        #d= self.get_argument('dist1')

        A = self.get_argument('AmbiguousWord')

        #ngramDist = self.get_argument('ngram')
        #try to grab website

        
        
##        try:
##            page = urllib2.urlopen(url).read()
##            accepted = True
##        except:
##            print('not accepted')

        p = multiprocessing.Process(target=pageGrab(url, whichList, A, idN, dataInitialized, self))
        #time.sleep(5)
        #print(A)
        #p.join()
        #page, accepted = pageGrab(url)

        
        
        

class Initializer(tornado.web.RequestHandler):
    def get(self):
        #idNum = self.get_argument('idNum')
        idN = allData.count;
        allData.setNewData();
        dataInitialized = True;
        allData.count = allData.count + 1
        returnPacket = {'idNum':idN, 'initialized':dataInitialized}
        self.write(returnPacket)
        self.finish()
        
class FrequencyFinder(tornado.web.RequestHandler):
    def post(self):
        #ngramRange = (1, ngDist)

        idNumber = self.get_argument('idNum')
        idNumber = int(idNumber)
        print("trying something");
        
        bigramVectorizer = CountVectorizer(ngram_range=(1,2), token_pattern=r'\b\w+\b',min_df=1, max_features = 500);
        
        transformed = bigramVectorizer.fit_transform([allData.instances[idNumber].P1Dat,allData.instances[idNumber].P2Dat,
                                                      allData.instances[idNumber].M1Dat,allData.instances[idNumber].M2Dat])
        
        tags = bigramVectorizer.get_feature_names()
        print(tags)
    
        
        #insert 0s if needed

        countsToReturn = []
        freqsToReturn = []

        #just the frequency scores sorted
        f=[]

        
        #minCount = 5

        tf_transformer = TfidfTransformer(use_idf=True).fit(transformed)
        
        tf = tf_transformer.transform(transformed)
        
        #print(X_train_tf.shape)


        #establish counts
        for doc in transformed:
            doc = doc.toarray()
            counts = {}
            
            for word, count in zip(tags,doc[0]):
                counts.update({word:int(count)})
            counts = sorted(counts.items(), key=lambda x: x[1], reverse=True)
            countsToReturn.append(counts)

        #establish frequencies
        for doc in tf:
            doc = doc.toarray()
            freqs = {}
            
            for word, freq in zip(tags,doc[0]):
                freqs.update({word:float(freq)})

            #sort by word and just grab fscore
            f.append([x[1] for x in sorted(freqs.items(), key=lambda x: x[0], reverse=True)])
            
            #sort by score for displaying
            freqs = sorted(freqs.items(), key=lambda x: x[1], reverse=True)
            freqsToReturn.append(freqs)
        
        

        #set data for frequencies and counts
        allData.instances[idNumber].counts = countsToReturn
        allData.instances[idNumber].freqs = freqsToReturn


        #calculate correlations
        
        print(f[0])
        print(f[2])

        c1x = pearsonr(f[0],f[2])
        c1y = pearsonr(f[0],f[3])
        c2x = pearsonr(f[1],f[2])
        c2y = pearsonr(f[1],f[3])

        
        
        
        #return sorted top frequency words   
        returnPacket = {'P1Freq':countsToReturn[0],'P2Freq':countsToReturn[1],
                        'M1Freq':countsToReturn[2],'M2Freq':countsToReturn[3], 'C1X':{'score':c1x},
                        'C1Y':{'score':c1y},'C2X':{'score':c2x},'C2Y':{'score':c2y}}
        self.write(returnPacket)
        self.finish()

        

        
            


if __name__ == '__main__':
    allData = Data();
    tornado.options.parse_command_line()
    app = tornado.web.Application(
            handlers=[(r'/',IndexHandler), (r'/urlGrab/', WebSiteGrabberHandler),
                      (r'/freqFinder/', FrequencyFinder), (r'/initialize/', Initializer)],
            #template_path=os.path.join(os.path.dirname(__file__), "templates"),
            static_path = os.path.join(os.path.dirname("__file__"), "static"),
            
        
        )
    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()

