import pandas as pd
from sklearn.tree import DecisionTreeClassifier
import joblib

# Load synthetic data
df = pd.read_csv("ml-data.csv")
X = df[["temp", "hum", "mq"]]
y = df["label"]

# Train Decision Tree
clf = DecisionTreeClassifier(max_depth=5)
clf.fit(X, y)

# Save the trained model
joblib.dump(clf, "model.joblib")
print("✅ Saved model.joblib")
