# triaje_api.py
from flask import Flask, request, jsonify
import numpy as np
import joblib
import pandas as pd

app = Flask(__name__)

# Carga el modelo
modelo = joblib.load('./public/py/modelo_randomforest.pkl')  # Guarda tu modelo con joblib.dump(best_model, 'modelo_random_forest.pkl')

# Columnas usadas en el entrenamiento (deben coincidir exactamente)
columnas = ['Sexo', 'Lesion', 'Mental', 'Dolor', 'Dolor_NRS',
            'PAS', 'PAD', 'FC',
            'FR', 'TC', 'Saturacion']

@app.route('/predecir', methods=['POST'])
def predecir():
    datos = request.get_json()
    df = pd.DataFrame([datos], columns=columnas)
    resultado = modelo.predict(df)
    return jsonify({'ktas': int(resultado[0])})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
