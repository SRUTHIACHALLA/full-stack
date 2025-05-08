from flask import Flask, jsonify
from surprise import dump

from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model_file = './recommender_model.pkl'
try:
    _, loaded_model = dump.load(model_file)
    print("✅ Model loaded successfully")
except Exception as e:
    print("❌ Failed to load model:", e)
    loaded_model = None

@app.route('/api/recommendations/<user_id>', methods=['GET'])
def get_recommendations(user_id):
    if not loaded_model:
        return jsonify({"message": "Recommendation service failed"}), 500

    try:
        # Catch unknown user
        try:
            inner_uid = loaded_model.trainset.to_inner_uid(user_id)
        except ValueError:
            return jsonify({"message": "User not in training data"}), 404

        all_items = loaded_model.trainset.all_items()
        predictions = [
            (iid, loaded_model.predict(inner_uid, iid).est)
            for iid in all_items
        ]
        predictions.sort(key=lambda x: x[1], reverse=True)
        top_n = [loaded_model.trainset.to_raw_iid(iid) for iid, _ in predictions[:5]]
        return jsonify(top_n)

    except Exception as e:
        print("❌ Error during prediction:", e)
        return jsonify({"message": "Recommendation service failed"}), 500

if __name__ == '__main__':
    app.run(debug=True)
