# query.py
from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import pickle

df = pd.read_csv("./dataset-indo.csv")

with open("tfidf_vectorizer.pkl", "rb") as f:
    tfidf_vectorizer = pickle.load(f)

with open("tfidf_matrix.pkl", "rb") as f:
    tfidf_matrix = pickle.load(f)

app = Flask(__name__)


def tfidfcosine(query):
    query_tfidf = tfidf_vectorizer.transform([query])
    cosine_sim_scores = cosine_similarity(query_tfidf, tfidf_matrix).flatten()
    return cosine_sim_scores


@app.route("/query", methods=["POST"])
def query_documents():
    data = request.json
    query = data.get("query", "")

    if not query:
        return jsonify({"error": "Query is required"}), 400

    cosine_sim_scores = tfidfcosine(query)
    top_cosine_indices = np.argsort(cosine_sim_scores)[::-1][:10]

    results = []
    for idx in top_cosine_indices:
        result = {
            "index": int(idx),
            "title": df.iloc[idx, 2],
            "score": float(cosine_sim_scores[idx]),
            "content": df.iloc[idx]["cleaned_content"],
        }
        results.append(result)

    return jsonify(results)


if __name__ == "__main__":
    app.run(debug=True)
