# diabetesPrediction
Diabetes Prediction using Logistic Regression in Python with sckit-learn 
# Diabetes Prediction using Logistic Regression

This project implements a machine learning model to predict whether a person is diabetic or not based on medical attributes. The model is built using **Logistic Regression** and trained on a diabetes dataset using **scikit-learn**.

The project demonstrates the complete ML pipeline including data loading, preprocessing, model training, evaluation, and prediction.

---

## 📊 Dataset

- The dataset is loaded from a CSV file (`diabetes.csv`)
- Target column: `Outcome`
  - `0` → Non-diabetic
  - `1` → Diabetic
- Features include:
  - Pregnancies
  - Glucose
  - Blood Pressure
  - Skin Thickness
  - Insulin
  - BMI
  - Diabetes Pedigree Function
  - Age

---

## ⚙️ Technologies Used

- Python
- Pandas
- Scikit-learn
- Google Colab / Jupyter Notebook

---

## 🧠 Model Used

- **Logistic Regression**
- Feature scaling using **StandardScaler**
- Train-test split (80% training, 20% testing)

---

## 📈 Model Evaluation

The model is evaluated using:
- Accuracy Score
- Confusion Matrix

Sample output:
- Accuracy ≈ **75%** (may vary depending on random state)

---

## 🔮 Prediction

The project supports:
1. Prediction on predefined sample patient data
2. Prediction based on user input (entered manually)

The model outputs:
- `0` → Not Diabetic
- `1` → Diabetic

---

## 🚀 How to Run the Project

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/diabetes-prediction.git
