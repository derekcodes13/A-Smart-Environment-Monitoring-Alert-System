# train_model.py
import joblib
from sklearn.datasets import make_classification
from sklearn.tree import DecisionTreeClassifier

# 1. Generate some sample data
X, y = make_classification(
    n_samples=100, n_features=3, n_informative=3, n_redundant=0, random_state=42
)

# 2. Train a simple Decision Tree model
clf = DecisionTreeClassifier()
clf.fit(X, y)

# 3. Save the trained model
joblib.dump(clf, "model.joblib")
print("✅ Model trained and saved as model.joblib")
