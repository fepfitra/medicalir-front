# indexing.py
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
import re
import pickle

df = pd.read_csv("./dataset-indo.csv")


def clean_text(text):
    if isinstance(text, str):
        text = re.sub(r"[^a-zA-Z]", " ", text)
        return text.lower()
    return ""


df["combined_content"] = df.apply(lambda row: " ".join(row.astype(str)), axis=1)
df["cleaned_content"] = df["combined_content"].apply(clean_text)

tfidf_vectorizer = TfidfVectorizer()
tfidf_matrix = tfidf_vectorizer.fit_transform(df["cleaned_content"])

with open("tfidf_vectorizer.pkl", "wb") as f:
    pickle.dump(tfidf_vectorizer, f)

with open("tfidf_matrix.pkl", "wb") as f:
    pickle.dump(tfidf_matrix, f)

print("Indexing completed and files saved.")
