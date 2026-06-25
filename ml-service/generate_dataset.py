import os
import pandas as pd
import numpy as np

# Seed for reproducibility
np.random.seed(42)

def generate_dev_dataset(num_samples=1000):
    # Features
    github_score = np.random.uniform(30, 100, num_samples)
    dsa_score = np.random.uniform(20, 100, num_samples)
    ats_score = np.random.uniform(40, 95, num_samples)
    projects_count = np.random.randint(1, 10, num_samples)
    skills_match_ratio = np.random.uniform(0.2, 1.0, num_samples)
    
    # Technology focus experiences (0 to 5 years represented as floats)
    frontend_exp = np.random.uniform(0.0, 5.0, num_samples)
    backend_exp = np.random.uniform(0.0, 5.0, num_samples)
    data_science_exp = np.random.uniform(0.0, 5.0, num_samples)
    devops_exp = np.random.uniform(0.0, 5.0, num_samples)
    
    # Calculate target 1: Placement Readiness Score (0-100)
    # Weighted calculation with a random noise component
    noise = np.random.normal(0, 3, num_samples)
    placement_readiness = (
        0.30 * github_score + 
        0.35 * dsa_score + 
        0.20 * ats_score + 
        1.5 * projects_count + 
        5.0 * skills_match_ratio + 
        noise
    )
    
    # Clamp readiness between 0 and 100
    placement_readiness = np.clip(placement_readiness, 0, 100)
    
    # Determine target 2: Recommended Career Role (Label encoded)
    # 0: MERN Developer
    # 1: Frontend Developer
    # 2: Backend Developer
    # 3: Data Scientist
    # 4: ML Engineer
    # 5: DevOps Engineer
    
    recommended_role = []
    for i in range(num_samples):
        fe = frontend_exp[i]
        be = backend_exp[i]
        ds = data_science_exp[i]
        do = devops_exp[i]
        dsa = dsa_score[i]
        
        if ds > 4.0 and dsa > 75:
            recommended_role.append(4)  # ML Engineer
        elif ds > 3.0:
            recommended_role.append(3)  # Data Scientist
        elif do > 3.5:
            recommended_role.append(5)  # DevOps Engineer
        elif fe > 3.0 and be > 3.0:
            recommended_role.append(0)  # MERN Developer
        elif fe > be + 1.0:
            recommended_role.append(1)  # Frontend Developer
        elif be > fe + 1.0:
            recommended_role.append(2)  # Backend Developer
        else:
            recommended_role.append(0)  # MERN Developer (default fallback)
            
    df = pd.DataFrame({
        'github_score': github_score,
        'dsa_score': dsa_score,
        'ats_score': ats_score,
        'projects_count': projects_count,
        'skills_match_ratio': skills_match_ratio,
        'frontend_exp': frontend_exp,
        'backend_exp': backend_exp,
        'data_science_exp': data_science_exp,
        'devops_exp': devops_exp,
        'placement_readiness': placement_readiness,
        'recommended_role': recommended_role
    })
    
    # Ensure directory exists
    os.makedirs('dataset', exist_ok=True)
    df.to_csv('dataset/placement_dataset.csv', index=False)
    print(f"Generated {num_samples} samples and saved to dataset/placement_dataset.csv")

if __name__ == '__main__':
    generate_dev_dataset()
