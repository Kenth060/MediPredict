# Paso 1: Cargar librerías necesarias
from google.colab import files
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import confusion_matrix, classification_report
from sklearn.model_selection import KFold, cross_val_score, GridSearchCV
from sklearn.metrics import accuracy_score
from sklearn.model_selection import learning_curve

# Paso 2: Cargar dataset
uploaded = files.upload()

# Paso 3: Leer archivo CSV
df = pd.read_csv('Dataset_Triaje.csv', delimiter=';', header=None)

# Paso 4: Asignar nombres a las columnas
df.columns = ['Grupo', 'Sexo', 'Edad', 'Modo_llegada', 'Lesion', 'Sintoma_texto',
              'Mental', 'Dolor', 'Dolor_NRS', 'PAS', 'PAD', 'FC', 'FR', 'TC', 'Saturacion', 'KTAS']

# Paso 5: Feature Engineering (retirar  variables inútiles)
df = df.drop(columns=['Sintoma_texto','Edad','Modo_llegada','Grupo'])  # texto libre fuera

# Paso 6: Separar características y etiquetas
X = df.drop(columns=['KTAS'])
Y = df['KTAS']
print("Distribución de clases en Y:")
print(Y.value_counts())

# Paso 7: División en entrenamiento y prueba (estratificada para balancear)
X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=357, stratify=Y)

# Paso 8: Modelo entrenado con mejores parámetros de GridSearch
best_model = RandomForestClassifier(
    n_estimators=50,         # menor número de árboles (menos sobreajuste)
    max_depth=5,              # más bajo que 11 (controla profundidad)
    min_samples_split=5,     # aumenta el mínimo de muestras para dividir un nodo
    min_samples_leaf=2,       # mínimo de muestras por hoja (más generalización)
    max_features='log2',      # reduce variables consideradas en cada división
    random_state=357
)

best_model.fit(X_train, Y_train)

# Paso 9: Predicciones
Y_pred = best_model.predict(X_test)

# Paso 10: Overfitting / Underfitting check
y_train_pred = best_model.predict(X_train)
acc_train = accuracy_score(Y_train, y_train_pred)
acc_test  = accuracy_score(Y_test,  Y_pred)
print(f"\n🔍 Exactitud en entrenamiento: {acc_train:.4f}")
print(f"🔍 Exactitud en prueba      : {acc_test:.4f}")

# Paso 11: Curvas de aprendizaje
train_sizes, train_scores, val_scores = learning_curve(
    best_model, X, Y,
    cv=5,
    train_sizes=np.linspace(0.1, 1.0, 10),
    scoring='accuracy',
    n_jobs=-1
)
train_mean = np.mean(train_scores, axis=1)
train_std  = np.std(train_scores,  axis=1)
val_mean   = np.mean(val_scores,   axis=1)
val_std    = np.std(val_scores,    axis=1)

plt.figure(figsize=(8,5))
plt.plot(train_sizes, train_mean, label='Train score')
plt.fill_between(train_sizes, train_mean-train_std, train_mean+train_std, alpha=0.2)
plt.plot(train_sizes, val_mean,   label='Validation score')
plt.fill_between(train_sizes, val_mean-val_std,   val_mean+val_std,   alpha=0.2)
plt.xlabel('Número de muestras de entrenamiento')
plt.ylabel('Exactitud')
plt.title('Curva de Aprendizaje')
plt.legend()
plt.show()

from sklearn.model_selection import cross_val_score
scores = cross_val_score(best_model, X, Y, cv=5, scoring='accuracy')
print(f"Validación cruzada promedio: {scores.mean():.4f}")

# ------------------------------------------
# Gráfica de exactitud en entrenamiento y validación
# ------------------------------------------
plt.figure(figsize=(8, 5))
plt.plot(train_sizes, train_mean, 'o-', color='blue', label='Entrenamiento')
plt.plot(train_sizes, val_mean, 'o-', color='green', label='Validación')
plt.fill_between(train_sizes, train_mean - train_std, train_mean + train_std, alpha=0.2, color='blue')
plt.fill_between(train_sizes, val_mean - val_std, val_mean + val_std, alpha=0.2, color='green')
plt.title('Exactitud de Entrenamiento vs Validación')
plt.xlabel('Tamaño del conjunto de entrenamiento')
plt.ylabel('Exactitud')
plt.legend(loc='best')
plt.grid(True)
plt.tight_layout()
plt.show()

# ------------------------------------------
# Gráfica de pérdida (1 - accuracy)
# ------------------------------------------
train_loss = 1 - train_mean
val_loss = 1 - val_mean

plt.figure(figsize=(8, 5))
plt.plot(train_sizes, train_loss, 'o-', color='red', label='Pérdida Entrenamiento')
plt.plot(train_sizes, val_loss, 'o-', color='orange', label='Pérdida Validación')
plt.fill_between(train_sizes, train_loss - train_std, train_loss + train_std, alpha=0.2, color='red')
plt.fill_between(train_sizes, val_loss - val_std, val_loss + val_std, alpha=0.2, color='orange')
plt.title('Pérdida (1 - Accuracy) en Entrenamiento vs Validación')
plt.xlabel('Tamaño del conjunto de entrenamiento')
plt.ylabel('Pérdida')
plt.legend(loc='best')
plt.grid(True)
plt.tight_layout()
plt.show()

# Paso 12: Reporte de Clasificación
print("\nReporte de Clasificación:")
print(classification_report(Y_test, Y_pred, target_names=['Urgente (1)', 'Urgencia media (2)', 'Urgencia leve (3)']))

# Paso 13: Matriz de Confusión
cm = confusion_matrix(Y_test, Y_pred)
plt.figure(figsize=(8,6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=['Urgente', 'Media', 'Leve'],
            yticklabels=['Urgente', 'Media', 'Leve'])
plt.xlabel('Predicción')
plt.ylabel('Valor Real')
plt.title('Matriz de Confusión - KTAS Agrupado')
plt.show()

# Paso 14: Importancia de características
importances = best_model.feature_importances_
feature_names = X.columns
plt.figure(figsize=(10,6))
sns.barplot(x=importances, y=feature_names)
plt.xlabel("Importancia")
plt.title("Importancia de características en Random Forest")
plt.show()

# Paso 15: Predicción para nuevo paciente (ejemplo)
nuevo_paciente = np.array([[2, 1,4,1, 10, 160, 135, 78, 18, 39.6, 50]])  # incluye las 2 nuevas columnas al final
nuevo_paciente_df = pd.DataFrame(nuevo_paciente, columns=X.columns)
prediccion = best_model.predict(nuevo_paciente_df)
print("\nPredicción para nuevo paciente → Nivel KTAS estimado:", prediccion[0])