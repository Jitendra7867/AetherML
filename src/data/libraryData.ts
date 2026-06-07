export interface CheatSheetItem {
  code: string;
  description: string;
}

export interface LibraryGuide {
  id: string;
  name: string;
  tagline: string;
  description: string;
  cheatSheet: CheatSheetItem[];
  playgroundCode: string;
  exercise: string;
  packages: string[];
}

export const libraryData: LibraryGuide[] = [
  {
    id: "numpy",
    name: "NumPy",
    tagline: "The foundation of numerical computing and matrix manipulation in Python.",
    description: "NumPy (Numerical Python) is the foundational package for scientific computing in Python. It provides a highly efficient multidimensional array object (`ndarray`), tools for working with these arrays, and linear algebra operations.",
    cheatSheet: [
      { code: "import numpy as np", description: "Standard import convention" },
      { code: "arr = np.array([1, 2, 3])", description: "Create a 1D vector from a list" },
      { code: "matrix = np.array([[1,2], [3,4]])", description: "Create a 2D matrix" },
      { code: "zeros = np.zeros((3, 3))", description: "Create a 3x3 matrix of zeros" },
      { code: "ranges = np.arange(0, 10, 2)", description: "Create sequence [0, 2, 4, 6, 8]" },
      { code: "reshaped = arr.reshape((3, 1))", description: "Change dimensions of array" },
      { code: "dot_product = np.dot(A, B)", description: "Matrix multiplication of A and B" },
      { code: "transpose = A.T", description: "Transpose rows and columns of matrix A" }
    ],
    playgroundCode: `import numpy as np

# Let's explore array slicing, math, and operations
data = np.array([[10, 20, 30],
                 [40, 50, 60],
                 [70, 80, 90]])

print("Original Array:")
print(data)

# Mean of all elements
print("\nOverall Mean:", np.mean(data))

# Mean along columns (axis=0)
print("Mean along columns:", np.mean(data, axis=0))

# Slice out the sub-matrix (top right 2x2)
sub_matrix = data[0:2, 1:3]
print("\nSub-matrix slice (top-right 2x2):\n", sub_matrix)
`,
    exercise: "Modify the matrix to be a 4x4 matrix and compute its determinant using np.linalg.det(matrix). Note: you will need to specify a square matrix.",
    packages: ["numpy"]
  },
  {
    id: "pandas",
    name: "Pandas",
    tagline: "Robust data manipulation structures (DataFrames and Series).",
    description: "Pandas is built on top of NumPy and provides high-performance, easy-to-use data structures and data analysis tools. The primary object is the `DataFrame` which acts like an interactive Excel sheet in memory.",
    cheatSheet: [
      { code: "import pandas as pd", description: "Standard import convention" },
      { code: "df = pd.DataFrame(data_dict)", description: "Create a DataFrame from a dictionary" },
      { code: "df.head()", description: "View the first 5 rows of data" },
      { code: "df.describe()", description: "Get summary statistics for numeric columns" },
      { code: "df['col_name']", description: "Select a specific column" },
      { code: "df[df['age'] > 30]", description: "Filter rows based on a conditional statement" },
      { code: "df.groupby('category').mean()", description: "Group by category and calculate means" },
      { code: "df.fillna(0)", description: "Replace NaN missing values with 0" }
    ],
    playgroundCode: `import pandas as pd

# Creating a DataFrame from a dictionary representing student scores
data = {
    'Student': ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan'],
    'Age': [20, 21, 19, 22, 21],
    'Score': [85, 92, 78, 95, 88],
    'Passed': [True, True, False, True, True]
}

df = pd.DataFrame(data)

print("Student DataFrame:")
print(df)
print("\nSummary Statistics of numeric columns:")
print(df.describe())

# Filtering students who scored above 90
print("\nStudents scoring above 90:")
high_scorers = df[df['Score'] > 90]
print(high_scorers)
`,
    exercise: "Calculate and print the mean score of students who are 21 years old. Hint: use filtering first, then extract the 'Score' column and run `.mean()`.",
    packages: ["numpy", "pandas"]
  },
  {
    id: "scikit-learn",
    name: "Scikit-Learn",
    tagline: "The premier Python toolkit for classical machine learning algorithms.",
    description: "Scikit-Learn (sklearn) is a powerful, simple tool for predictive data analysis. It includes implementations of classification, regression, clustering, dimensionality reduction, model evaluation, and preprocessing.",
    cheatSheet: [
      { code: "from sklearn.model_selection import train_test_split", description: "Split dataset into train and test sets" },
      { code: "from sklearn.linear_model import LogisticRegression", description: "Import a classifier model" },
      { code: "model = LogisticRegression()", description: "Instantiate model object" },
      { code: "model.fit(X_train, y_train)", description: "Train the model on features & labels" },
      { code: "predictions = model.predict(X_test)", description: "Predict class labels on unseen data" },
      { code: "from sklearn.metrics import accuracy_score", description: "Import metric evaluator" },
      { code: "accuracy = accuracy_score(y_test, predictions)", description: "Evaluate classification accuracy" }
    ],
    playgroundCode: `import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.datasets import make_classification

# Generate a synthetic binary classification dataset
X, y = make_classification(n_samples=50, n_features=4, n_classes=2, random_state=42)

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Initialize Classifier (K-Nearest Neighbors, K=3)
knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(X_train, y_train)

# Evaluate
train_acc = knn.score(X_train, y_train)
test_acc = knn.score(X_test, y_test)

print(f"Training set accuracy: {train_acc * 100:.2f}%")
print(f"Testing set accuracy: {test_acc * 100:.2f}%")
print("\\nTesting Predictions:", knn.predict(X_test))
print("True Testing Labels:", y_test)
`,
    exercise: "Change the number of neighbors (n_neighbors) to 5. Run the code and see if the test accuracy changes.",
    packages: ["numpy", "scikit-learn"]
  },
  {
    id: "deep-learning",
    name: "TensorFlow & PyTorch",
    tagline: "Powerhouses of Deep Learning and Neural Network computation.",
    description: "TensorFlow (by Google) and PyTorch (by Meta) are the two primary framework libraries for building neural networks. They provide GPU acceleration, automatic differentiation, and layers to compile deep neural networks. Since WebAssembly runs in the browser CPU, we mock PyTorch-like layer structures here or run NumPy-based neural models.",
    cheatSheet: [
      { code: "import torch", description: "Import PyTorch framework" },
      { code: "import tensorflow as tf", description: "Import TensorFlow framework" },
      { code: "x = torch.tensor([1., 2.])", description: "Create a PyTorch tensor (supports gradients)" },
      { code: "model = tf.keras.Sequential([...])", description: "Define a simple Keras neural network" },
      { code: "optimizer = torch.optim.Adam(params)", description: "Set up PyTorch optimization parameters" },
      { code: "loss.backward()", description: "Trigger automatic backpropagation in PyTorch" }
    ],
    playgroundCode: `# Let's demonstrate building a conceptual Deep Learning layer in Python
# We will construct a Dense neural layer from scratch in NumPy to see
# exactly how PyTorch/TensorFlow calculate forward passes.

import numpy as np

class DenseLayer:
    def __init__(self, input_dim, output_dim):
        # Initialize weights and biases randomly
        self.weights = np.random.randn(input_dim, output_dim) * 0.01
        self.biases = np.zeros((1, output_dim))
        
    def forward(self, inputs):
        # z = X * W + b
        self.output = np.dot(inputs, self.weights) + self.biases
        # Apply ReLU activation function: max(0, output)
        return np.maximum(0, self.output)

# 2 data points, each has 3 features (e.g. Size, Rooms, Location Score)
X = np.array([[1.5, 2.0, 0.5],
              [3.0, 4.0, 1.2]])

# Initialize dense layer mapping 3 features to 4 hidden nodes
layer = DenseLayer(input_dim=3, output_dim=4)
activated_output = layer.forward(X)

print("Input Data Shape:", X.shape)
print("Layer weights Shape:", layer.weights.shape)
print("Activated layer output (post-ReLU):\n", activated_output)
`,
    exercise: "Add a second dense layer that takes the 4 outputs of the first layer and shrinks them to 1 output value (predicting housing price). Pass the activated_output of layer 1 through layer 2 and print the final output.",
    packages: ["numpy"]
  }
];
