from sklearn.metrics import (
    classification_report,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix
)
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np


def evaluate_model(y_true, y_pred, average='macro'):
    print("Classification Report:")
    print(classification_report(y_true, y_pred))

    metrics = {
        "accuracy": round(accuracy_score(y_true, y_pred), 4),
        "precision": round(precision_score(y_true, y_pred, average=average), 4),
        "recall": round(recall_score(y_true, y_pred, average=average), 4),
        "f1_score": round(f1_score(y_true, y_pred, average=average), 4)
    }

    return metrics


def plot_confusion_matrix(y_true, y_pred, labels, title="Confusion Matrix"):
    cm = confusion_matrix(y_true, y_pred, labels=labels)
    plt.figure(figsize=(6, 5))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=labels, yticklabels=labels)
    plt.title(title)
    plt.xlabel('Predicted')
    plt.ylabel('True')
    plt.tight_layout()
    plt.show()


def plot_word_importance(model, vectorizer, class_names, top_n=10):
    feature_names = np.array(vectorizer.get_feature_names_out())
    coef = model.model.coef_

    for idx, class_label in enumerate(class_names):
        top_coef_idx = np.argsort(coef[idx])[-top_n:]      
        top_features = feature_names[top_coef_idx]
        top_weights = coef[idx][top_coef_idx]

        plt.figure(figsize=(8, 4))
        plt.barh(top_features, top_weights)
        plt.xlabel("Weight")
        plt.title(f"Top {top_n} Important Words for Class: {class_label}")
        plt.tight_layout()
        plt.show()
