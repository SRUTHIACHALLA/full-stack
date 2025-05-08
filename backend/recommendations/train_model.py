import pandas as pd
from surprise import Dataset, Reader, SVD, dump

# Load interactions.csv
df = pd.read_csv("interactions.csv")
df.columns = ['user_id', 'product_id', 'interaction']

# Prepare Surprise dataset
reader = Reader(rating_scale=(1, 5))
data = Dataset.load_from_df(df[['user_id', 'product_id', 'interaction']], reader)
trainset = data.build_full_trainset()

# Train the model
model = SVD()
model.fit(trainset)

# Save the trained model
dump.dump("recommender_model.pkl", algo=model)
print("✅ Model trained and saved as recommender_model.pkl")
