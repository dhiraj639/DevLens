import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.feature_extraction.text import TfidfVectorizer
import xgboost as xgb
import joblib

def train_models():
    # 1. Load placement dataset
    if not os.path.exists('dataset/placement_dataset.csv'):
        print("Dataset not found. Running generate_dataset.py first...")
        import generate_dataset
        generate_dataset.generate_dev_dataset()
        
    df = pd.read_csv('dataset/placement_dataset.csv')
    
    # Split features and targets
    X = df[['github_score', 'dsa_score', 'ats_score', 'projects_count', 'skills_match_ratio', 
            'frontend_exp', 'backend_exp', 'data_science_exp', 'devops_exp']]
    
    y_placement = df['placement_readiness']
    y_role = df['recommended_role']
    
    # Train/Test Split
    X_train, X_test, y_p_train, y_p_test = train_test_split(X, y_placement, test_size=0.2, random_state=42)
    _, _, y_r_train, y_r_test = train_test_split(X, y_role, test_size=0.2, random_state=42)
    
    # Train Random Forest Regressor for Placement Readiness
    print("Training Random Forest Regressor...")
    placement_model = RandomForestRegressor(n_estimators=100, random_state=42)
    placement_model.fit(X_train, y_p_train)
    p_train_score = placement_model.score(X_train, y_p_train)
    p_test_score = placement_model.score(X_test, y_p_test)
    print(f"Placement Model R^2 - Train: {p_train_score:.4f}, Test: {p_test_score:.4f}")
    
    # Train XGBoost Classifier for Role Recommendation
    print("Training XGBoost Classifier...")
    role_model = xgb.XGBClassifier(random_state=42, use_label_encoder=False, eval_metric='mlogloss')
    role_model.fit(X_train, y_r_train)
    r_train_score = role_model.score(X_train, y_r_train)
    r_test_score = role_model.score(X_test, y_r_test)
    print(f"Role Model Accuracy - Train: {r_train_score:.4f}, Test: {r_test_score:.4f}")
    
    # Save the models
    joblib.dump(placement_model, 'placement_model.pkl')
    joblib.dump(role_model, 'role_model.pkl')
    print("Serialized models successfully.")
    
    # 2. Fit TF-IDF Vectorizer on typical developer role descriptions
    print("Fitting TF-IDF Vectorizer...")
    role_descriptions = {
        "MERN Developer": "javascript react node express mongodb html css git rest api redux fullstack web development database sql",
        "Frontend Developer": "javascript react html css typescript tailwind sass css3 web frontend designer redux angular vue",
        "Backend Developer": "node express javascript python backend java golang postgresql mongodb sql api rest docker gpc aws redis database microservices",
        "Data Scientist": "python sql machine learning pandas numpy statistics data science r analytics math visualization tableau powerbi dashboard spark",
        "ML Engineer": "python machine learning deep learning pytorch tensorflow scikit-learn model deployment dsa algorithms math neural networks data pipeline nlp cv",
        "DevOps Engineer": "docker kubernetes aws jenkins cicd linux cloud systems administration terraform ansible bash shell script monitoring git networking security"
    }
    
    # Fit vectorizer on all descriptions
    vectorizer = TfidfVectorizer(stop_words='english')
    vectorizer.fit(list(role_descriptions.values()))
    
    # Save vectorizer and descriptions
    joblib.dump(vectorizer, 'vectorizer.pkl')
    joblib.dump(role_descriptions, 'role_descriptions.pkl')
    print("Serialized vectorizer successfully.")

if __name__ == '__main__':
    train_models()
