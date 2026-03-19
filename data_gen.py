import pandas as pd
import numpy as np
import random

# Set seed for reproducibility
np.random.seed(42)
random.seed(42)

n_samples = 2000

# Base coordinate ranges around your given data (Rourkela region)
lat_range = (22.10, 22.40)
lon_range = (84.70, 84.95)

soil_types = ['alluvium', 'clay', 'sand', 'rock']
materials = ['brick', 'rc', 'steel']
foundations = ['shallow', 'pile', 'raft']

data = []

for _ in range(n_samples):
    lat = round(np.random.uniform(*lat_range), 4)
    lon = round(np.random.uniform(*lon_range), 4)
    
    vs30 = np.random.randint(180, 650)
    
    soil = random.choice(soil_types)
    floors = np.random.randint(1, 13)
    material = random.choice(materials)
    age = np.random.randint(1, 50)
    foundation = random.choice(foundations)
    
    # Rule-based damage logic (realistic pattern)
    damage = 0
    
    if material == 'brick':
        damage += 2
    elif material == 'rc':
        damage += 1
    
    if soil in ['alluvium', 'clay']:
        damage += 1
    
    if vs30 < 250:
        damage += 1
    
    if age > 30:
        damage += 1
    
    if foundation == 'shallow':
        damage += 1
    
    if floors > 8:
        damage -= 1
    
    # Clamp damage level between 0–4
    damage = max(0, min(4, damage))
    
    data.append([
        lat, lon, vs30, soil, floors,
        material, age, foundation, damage
    ])

# Create DataFrame
df = pd.DataFrame(data, columns=[
    'latitude','longitude','vs30','soil_type',
    'floors','building_material','building_age',
    'foundation_type','damage_level'
])

# Save to CSV
df.to_csv("earthquake_damage_2000.csv", index=False)

print(df.head())