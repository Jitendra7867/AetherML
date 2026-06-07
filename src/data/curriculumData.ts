export interface TopicSection {
  type: 'paragraph' | 'header' | 'math' | 'list';
  content: string | string[];
}

export interface Topic {
  id: string;
  title: string;
  module: string;
  summary: string;
  theory: TopicSection[];
  visualizer: 'gradient-descent' | 'k-means' | 'decision-tree' | null;
  defaultCode: string;
  exerciseTask: string;
  packages: string[];
}

export const modules = [
  "Math & Stats Foundations",
  "Supervised Learning",
  "Unsupervised Learning",
  "Deep Learning",
  "Reinforcement Learning"
];

export const curriculumData: Topic[] = [
  {
    id: "linear-algebra",
    title: "Linear Algebra & Matrices",
    module: "Math & Stats Foundations",
    summary: "Master vectors, matrices, and matrix multiplication — the mathematical language of machine learning.",
    theory: [
      { type: "header", content: "Introduction to Linear Algebra" },
      { type: "paragraph", content: "In Machine Learning, dataset records are treated as vectors, and complete datasets are represented as matrices. For instance, an image of size 28x28 pixels is a matrix of 784 numbers. Any transform, translation, neural layer activation, or weights dot-product is a series of matrix operations." },
      { type: "header", content: "Why We Need It" },
      { type: "paragraph", content: "We need Linear Algebra because standard CPU loops are too slow to perform calculations on millions of variables sequentially. Expressing operations as matrices allows us to compute activations in parallel. Graphics Processing Units (GPUs) are specifically designed to execute massive matrix calculations simultaneously. Without Linear Algebra, modern Deep Learning would be computationally impossible." },
      { type: "header", content: "How it Works" },
      { type: "paragraph", content: "A vector is an ordered 1D array of numbers representing a point in space. A matrix is a 2D grid of numbers. Let's denote a matrix A of dimensions m × n, where m is rows and n is columns:" },
      { type: "math", content: "A = \\begin{pmatrix} a_{11} & a_{12} & \\dots & a_{1n} \\\\ a_{21} & a_{22} & \\dots & a_{2n} \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ a_{m1} & a_{m2} & \\dots & a_{mn} \\end{pmatrix}" },
      { type: "paragraph", content: "To multiply matrix A (shape m × n) by matrix B (shape n × p) to get matrix C (shape m × p), we take the dot product of the rows of A and the columns of B:" },
      { type: "math", content: "C_{ij} = \\sum_{k=1}^{n} A_{ik} B_{kj}" },
      { type: "paragraph", content: "The number of columns in A must match the number of rows in B for multiplication to be defined." },
      { type: "header", content: "Real-World Analogy: Smart Weights" },
      { type: "paragraph", content: "Imagine you are scoring multiple houses. Each house has characteristics (vector of size, bedrooms, age). You have a weights matrix that scores each characteristic's importance (price index, school-district grade). Multiplying the house matrix by the weights matrix outputs the overall scores instantly." }
    ],
    visualizer: null,
    defaultCode: `import numpy as np

# Create two-dimensional arrays (matrices)
A = np.array([[1, 2, 3], 
              [4, 5, 6]]) # 2x3 matrix
              
B = np.array([[7, 8], 
              [9, 10], 
              [11, 12]]) # 3x2 matrix

# Compute the Matrix Dot Product
C = np.dot(A, B)

print("Matrix A (2x3):\n", A)
print("\nMatrix B (3x2):\n", B)
print("\nProduct C = A @ B (2x2):\n", C)

# Let's perform a Transpose of C
C_T = C.T
print("\nTranspose of C:\n", C_T)
`,
    exerciseTask: "Try altering the values in matrix A and B. Verify that changing dimensions results in a valid matrix multiplication (columns of A must equal rows of B). Run the script to see the new outputs.",
    packages: ["numpy"]
  },
  {
    id: "calculus",
    title: "Calculus & Gradients",
    module: "Math & Stats Foundations",
    summary: "Understand derivatives, partial derivatives, and gradients that drive model training.",
    theory: [
      { type: "header", content: "Introduction to Calculus" },
      { type: "paragraph", content: "Calculus is the mathematical study of continuous change. In machine learning, we use calculus to adjust model parameters to make better predictions." },
      { type: "header", content: "Why We Need It" },
      { type: "paragraph", content: "We need calculus to optimize models. When a model makes predictions, we calculate the error using a Loss Function. To improve the model, we need to know whether to increase or decrease each weight, and by how much. The derivative tells us the rate of change of the loss with respect to each weight, giving us the mathematical direction to reduce the error." },
      { type: "header", content: "How it Works" },
      { type: "paragraph", content: "The derivative of a function f(x) measures the rate of change of the function value with respect to x, representing the slope of the tangent line at any point x:" },
      { type: "math", content: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}" },
      { type: "paragraph", content: "For multivariable functions, we compute partial derivatives with respect to one variable while holding all other variables constant. The gradient collects all partial derivatives into a vector, which points in the direction of the steepest ascent:" },
      { type: "math", content: "\\nabla f(x_1, x_2, \\dots, x_d) = \\begin{bmatrix} \\frac{\\partial f}{\\partial x_1} \\\\ \\frac{\\partial f}{\\partial x_2} \\\\ \\vdots \\\\ \\frac{\\partial f}{\\partial x_d} \\end{bmatrix}" }
    ],
    visualizer: null,
    defaultCode: `# Numerical differentiation of a multi-variable function
# Let's define: f(x, y) = x^2 + 3*x*y + y^3

def f(x, y):
    return x**2 + 3*x*y + y**3

# Calculate gradient numerically at (x=2.0, y=1.0)
x, y = 2.0, 1.0
h = 1e-6

# Partial derivative wrt x: (f(x+h, y) - f(x-h, y)) / (2h)
df_dx = (f(x + h, y) - f(x - h, y)) / (2 * h)

# Partial derivative wrt y: (f(x, y+h) - f(x, y-h)) / (2h)
df_dy = (f(x, y + h) - f(x, y - h)) / (2 * h)

print(f"At point x = {x}, y = {y}:")
print(f"Numerical Gradient vector: [{df_dx:.4f}, {df_dy:.4f}]")
print(f"Analytical Gradient: [{2*x + 3*y:.4f}, {3*x + 3*(y**2):.4f}]")
`,
    exerciseTask: "Modify the function f(x, y) to another formula (e.g. x**3 - y**2) and update its analytical print values. Check if the numerical calculation matches your math derivations.",
    packages: []
  },
  {
    id: "statistics",
    title: "Probability & Bayes' Theorem",
    module: "Math & Stats Foundations",
    summary: "Dive into distributions, probability, and Bayes' Theorem which empowers classifiers.",
    theory: [
      { type: "header", content: "Introduction to Probability" },
      { type: "paragraph", content: "Probability is the measure of the likelihood that an event will occur. It provides the framework for modeling uncertainty and noise in real-world data." },
      { type: "header", content: "Why We Need It" },
      { type: "paragraph", content: "We need probability because datasets are never perfect; they contain noise, missing values, and natural variability. Probabilistic models (like Naive Bayes classifiers) make decisions based on likelihoods and conditional dependencies. It allows models to output not just a prediction, but a confidence level (e.g., '92% probability of spam'), which is vital for safety and decision-making." },
      { type: "header", content: "How it Works" },
      { type: "paragraph", content: "Conditional probability P(A | B) is the probability of event A given B has occurred. Bayes' Theorem allows us to update our prior beliefs based on new evidence:" },
      { type: "math", content: "P(A | B) = \\frac{P(B | A) \\cdot P(A)}{P(B)}" },
      { type: "paragraph", content: "In Machine Learning, we express this in terms of model parameters θ and observed data D:" },
      { type: "math", content: "P(\\theta | D) = \\frac{P(D | \\theta) \\cdot P(\\theta)}{P(D)}" },
      { type: "list", content: [
        "P(θ | D) is the Posterior probability: our updated belief about parameters after seeing the data.",
        "P(D | θ) is the Likelihood: how likely is the data given these parameters.",
        "P(θ) is the Prior: our belief before seeing any data.",
        "P(D) is the Evidence: normalization constant."
      ] }
    ],
    visualizer: null,
    defaultCode: `# Let's write a simple Naive Bayes Classifier from scratch for spam detection
# A simple prior of Spam vs Ham (Not Spam) and vocabulary statistics

prior_spam = 0.4  # 40% of incoming emails are spam
prior_ham = 0.6   # 60% of incoming emails are ham

# Probabilities of the word "buy" appearing: P(word | class)
p_buy_given_spam = 0.8
p_buy_given_ham = 0.1

# Let's calculate P(Spam | "buy") using Bayes' Theorem:
# P(Spam|buy) = (P(buy|Spam) * P(Spam)) / P(buy)
# where P(buy) = P(buy|Spam)*P(Spam) + P(buy|Ham)*P(Ham)

p_buy = (p_buy_given_spam * prior_spam) + (p_buy_given_ham * prior_ham)
p_spam_given_buy = (p_buy_given_spam * prior_spam) / p_buy

print(f"Total probability of seeing the word 'buy': {p_buy:.3f}")
print(f"Probability that email is SPAM if it contains 'buy': {p_spam_given_buy * 100:.2f}%")
`,
    exerciseTask: "Suppose we receive a new word 'free' with P(free | Spam) = 0.9 and P(free | Ham) = 0.15. Write code to recalculate the spam probability if an email contains the word 'free'.",
    packages: []
  },
  {
    id: "regression-overview",
    title: "Regression Concepts & Metrics",
    module: "Supervised Learning",
    summary: "Understand how regression models predict continuous quantities, and how to evaluate them.",
    theory: [
      { type: "header", content: "Introduction to Regression" },
      { type: "paragraph", content: "Regression is a subfield of supervised learning where the target variable is continuous (e.g., house prices, temperature, stock trends). The goal is to establish a mathematical function that maps input features to a continuous output." },
      { type: "header", content: "Why We Need It" },
      { type: "paragraph", content: "Without regression, models could only classify data into discrete bins (like 'expensive' vs 'cheap'), rather than predicting exact values. Evaluating regression models requires metrics that measure distance between predictions and actual targets, helping us identify whether models are underfitting (too simple) or overfitting (memorizing noise)." },
      { type: "header", content: "How it Works" },
      { type: "paragraph", content: "We evaluate a regression model by calculating the residuals (errors) $e_i = y_i - \\hat{y}_i$. The most common metrics are:" },
      { type: "paragraph", content: "1. Mean Squared Error (MSE): Penalizes larger errors heavily by squaring them:" },
      { type: "math", content: "MSE = \\frac{1}{N} \\sum_{i=1}^{N} (y_i - \\hat{y}_i)^2" },
      { type: "paragraph", content: "2. Mean Absolute Error (MAE): Measures average magnitude of error linearly:" },
      { type: "math", content: "MAE = \\frac{1}{N} \\sum_{i=1}^{N} |y_i - \\hat{y}_i|" },
      { type: "paragraph", content: "3. Coefficient of Determination (R² Score): Measures the proportion of variance explained by the model, where 1.0 is perfect and 0.0 is equivalent to predicting the mean:" },
      { type: "math", content: "R^2 = 1 - \\frac{\\sum (y_i - \\hat{y}_i)^2}{\\sum (y_i - \\bar{y})^2}" }
    ],
    visualizer: null,
    defaultCode: `import numpy as np
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

# True targets and model predictions
y_true = np.array([3.0, -0.5, 2.0, 7.0])
y_pred = np.array([2.5, 0.0, 2.1, 7.8])

# Calculate evaluation metrics
mse = mean_squared_error(y_true, y_pred)
mae = mean_absolute_error(y_true, y_pred)
r2 = r2_score(y_true, y_pred)

print("Actual values:", y_true)
print("Predicted values:", y_pred)
print(f"Mean Squared Error (MSE): {mse:.4f}")
print(f"Mean Absolute Error (MAE): {mae:.4f}")
print(f"R2 Score (Variance Explained): {r2:.4f} ({r2*100:.1f}%)")
`,
    exerciseTask: "Change one of the predictions to be very far from the true value (e.g. change 7.8 to 12.0) and re-run. Observe how the MSE increases much faster than the MAE due to squaring.",
    packages: ["numpy", "scikit-learn"]
  },
  {
    id: "classification-overview",
    title: "Classification Concepts & Metrics",
    module: "Supervised Learning",
    summary: "Master discrete category predictions and core metrics like Precision, Recall, and F1-Score.",
    theory: [
      { type: "header", content: "Introduction to Classification" },
      { type: "paragraph", content: "Classification is a supervised learning task where the output is a discrete category or label (e.g. 'Spam' vs 'Not Spam', 'Dog' vs 'Cat')." },
      { type: "header", content: "Why We Need It" },
      { type: "paragraph", content: "Simple accuracy (percentage of correct predictions) is highly misleading when dealing with imbalanced datasets. For example, if 99% of transactions are legitimate, a model that predicts 'legitimate' for everything achieves 99% accuracy but fails to detect any fraud. We need specialized metrics (Precision, Recall, F1-Score) to measure positive and negative classification performance separately." },
      { type: "header", content: "How it Works" },
      { type: "paragraph", content: "Predictions are grouped into a Confusion Matrix containing True Positives (TP), False Positives (FP), True Negatives (TN), and False Negatives (FN):" },
      { type: "list", content: [
        "Accuracy: Proportion of correct predictions: (TP + TN) / (TP + TN + FP + FN)",
        "Precision: Out of all predicted positive cases, how many were actually positive: TP / (TP + FP) (crucial when false positives are expensive, like spam filtering)",
        "Recall (Sensitivity): Out of all actual positive cases, how many did we find: TP / (TP + FN) (crucial when false negatives are dangerous, like cancer diagnosis)",
        "F1-Score: Harmonic mean of Precision and Recall, providing a single balanced metric:"
      ] },
      { type: "math", content: "F_1 = 2 \\cdot \\frac{\\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}}" }
    ],
    visualizer: null,
    defaultCode: `import numpy as np
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

# True class labels (0 = Negative, 1 = Positive)
# Imbalanced example: mostly 0s, only three 1s
y_true = np.array([0, 0, 0, 0, 1, 0, 1, 0, 0, 1])
y_pred = np.array([0, 0, 0, 0, 0, 0, 1, 1, 0, 1])

# Calculate classification metrics
accuracy = accuracy_score(y_true, y_pred)
precision = precision_score(y_true, y_pred)
recall = recall_score(y_true, y_pred)
f1 = f1_score(y_true, y_pred)

print("True Labels:", y_true)
print("Predictions:", y_pred)
print(f"Accuracy:  {accuracy*100:.1f}%")
print(f"Precision: {precision*100:.1f}% (TP / (TP + FP))")
print(f"Recall:    {recall*100:.1f}% (TP / (TP + FN))")
print(f"F1-Score:  {f1:.4f}")
`,
    exerciseTask: "Update y_pred so that it misses all positive cases (predicts 0 for every element) and run the script. See how accuracy remains high (70%) but Precision, Recall, and F1 drop to 0, demonstrating why accuracy is misleading.",
    packages: ["numpy", "scikit-learn"]
  },
  {
    id: "gradient-descent",
    title: "Gradient Descent",
    module: "Supervised Learning",
    summary: "Animate and analyze the primary optimization algorithm of ML.",
    theory: [
      { type: "header", content: "Introduction to Gradient Descent" },
      { type: "paragraph", content: "Gradient Descent is a generic optimization algorithm capable of finding optimal solutions to a wide range of problems by minimizing cost functions." },
      { type: "header", content: "Why We Need It" },
      { type: "paragraph", content: "For many machine learning models (like deep neural networks), we cannot solve for the optimal weights analytically (there is no direct formula). We need a numerical optimization method that can iteratively search the parameter space and adjust weights to reduce error. Gradient descent does this efficiently, scaling to models with billions of parameters." },
      { type: "header", content: "How it Works" },
      { type: "paragraph", content: "To find the minimum of a cost function J(w), Gradient Descent calculates the local gradient (derivative) of the cost function and takes steps in the opposite direction:" },
      { type: "math", content: "w^{(t+1)} = w^{(t)} - \\alpha \\cdot \\nabla J(w^{(t)})" },
      { type: "paragraph", content: "The steps are repeated until the gradient is close to zero (convergence):" },
      { type: "list", content: [
        "Initialize weights w with random values.",
        "Calculate the loss derivative (gradient) at the current position.",
        "Update the weights by subtracting the gradient scaled by the learning rate α.",
        "Repeat until the cost stops decreasing."
      ] }
    ],
    visualizer: "gradient-descent",
    defaultCode: `# Python implementation of Gradient Descent from scratch
import numpy as np

# We want to minimize the quadratic loss function: J(w) = (w - 4)^2
# The derivative is: dJ/dw = 2 * (w - 4)

w = 10.0            # Initial weight guess
learning_rate = 0.1 # Learning rate
iterations = 25

print(f"Starting Gradient Descent at w = {w}")
print("---------------------------------------")

for i in range(iterations):
    gradient = 2 * (w - 4)
    w = w - learning_rate * gradient
    loss = (w - 4)**2
    print(f"Iteration {i+1:02d}: w = {w:.5f} | Loss = {loss:.5f}")

print("---------------------------------------")
print(f"Final converged weight w: {w:.5f} (Target minimum: 4.0)")
`,
    exerciseTask: "Change the learning_rate variable in the Python code to 0.95 (very high) and run the script. See how the weights bounce back and forth, illustrating overshooting. Then change it to 0.01 and observe how slow it converges.",
    packages: ["numpy"]
  },
  {
    id: "linear-regression",
    title: "Linear Regression",
    module: "Supervised Learning",
    summary: "Predict continuous values using the classic straight-line fit.",
    theory: [
      { type: "header", content: "Introduction to Linear Regression" },
      { type: "paragraph", content: "Linear Regression is a basic and commonly used type of predictive analysis that fits a linear relationship between a dependent target variable and independent features." },
      { type: "header", content: "Why We Need It" },
      { type: "paragraph", content: "We need Linear Regression because it is the simplest, most interpretable model for predicting continuous outputs. It serves as the baseline for all regression tasks. The weights learned represent the direct influence of each feature on the prediction (e.g., 'every additional bedroom adds \$50k to house value'), allowing us to easily interpret the model's decisions." },
      { type: "header", content: "How it Works" },
      { type: "paragraph", content: "We predict outputs using a linear combination of features w and a bias b:" },
      { type: "math", content: "\\hat{y} = w \\cdot x + b" },
      { type: "paragraph", content: "We measure model performance using Mean Squared Error (MSE) over N samples:" },
      { type: "math", content: "MSE(w, b) = \\frac{1}{N} \\sum_{i=1}^{N} (y_i - (w \\cdot x_i + b))^2" },
      { type: "paragraph", content: "To train the model, we calculate partial derivatives of the loss function and update the parameters using gradient descent:" },
      { type: "math", content: "\\frac{\\partial MSE}{\\partial w} = -\\frac{2}{N} \\sum_{i=1}^{N} x_i (y_i - \\hat{y}_i) \\quad , \\quad \\frac{\\partial MSE}{\\partial b} = -\\frac{2}{N} \\sum_{i=1}^{N} (y_i - \\hat{y}_i)" }
    ],
    visualizer: null,
    defaultCode: `import numpy as np
from sklearn.linear_model import LinearRegression

# Let's generate fake data: House Size (sqft) vs Price ($100ks)
# Price = 0.5 * Size + 1.2 + Noise
np.random.seed(42)
X = np.random.rand(15, 1) * 3 + 1 # Sizes between 1 and 4 (1000 to 4000 sqft)
y = 0.5 * X + 1.2 + np.random.randn(15, 1) * 0.15

# Initialize and fit the Scikit-Learn model
model = LinearRegression()
model.fit(X, y)

# Print parameters
w = model.coef_[0][0]
b = model.intercept_[0]
print(f"Fitted Equation: Price = {w:.3f} * Size + {b:.3f}")

# Predict the price of a 2500 sqft house (Size = 2.5)
test_size = np.array([[2.5]])
pred_price = model.predict(test_size)[0][0]
print(f"Predicted Price for 2.5k sqft: \${pred_price*100000:.2f}")
`,
    exerciseTask: "Use Scikit-Learn's model to predict the price of a house that is 3.5k sqft (Size = 3.5). Print out the result.",
    packages: ["numpy", "scikit-learn"]
  },
  {
    id: "logistic-regression",
    title: "Logistic Regression",
    module: "Supervised Learning",
    summary: "Classify data using the sigmoid probability curve.",
    theory: [
      { type: "header", content: "Introduction to Logistic Regression" },
      { type: "paragraph", content: "Despite its name, Logistic Regression is a classification algorithm used to estimate the probability that an instance belongs to a particular class." },
      { type: "header", content: "Why We Need It" },
      { type: "paragraph", content: "Linear regression fails for classification because its outputs can go to positive or negative infinity, which cannot represent probabilities. We need Logistic Regression to squeeze the output of a linear model into the range [0, 1] using the Sigmoid function, mapping inputs to valid class probabilities." },
      { type: "header", content: "How it Works" },
      { type: "paragraph", content: "We pass the linear model's score through the Sigmoid activation function σ:" },
      { type: "math", content: "\\sigma(z) = \\frac{1}{1 + e^{-z}}" },
      { type: "math", content: "\\hat{y} = \\sigma(w \\cdot x + b) = P(y=1 | x)" },
      { type: "paragraph", content: "To optimize the weights, we minimize the Binary Cross-Entropy (Log Loss) function:" },
      { type: "math", content: "J(w, b) = -\\frac{1}{N} \\sum_{i=1}^{N} [y_i \\log(\\hat{y}_i) + (1 - y_i) \\log(1 - \\hat{y}_i)]" }
    ],
    visualizer: null,
    defaultCode: `import numpy as np
from sklearn.linear_model import LogisticRegression

# Binary classification data: Hours Studied vs Passed (0 = No, 1 = Yes)
X = np.array([[0.5], [1.0], [1.5], [1.8], [2.0], [2.5], [3.0], [3.5], [4.0], [5.0]])
y = np.array([0, 0, 0, 0, 0, 1, 1, 1, 1, 1])

# Initialize and fit Logistic Regression model
model = LogisticRegression()
model.fit(X, y)

# Probability of passing for 2.2 hours and 4.5 hours of study
test_hours = np.array([[2.2], [4.5]])
probs = model.predict_proba(test_hours)[:, 1]

print("Model intercept:", model.intercept_)
print("Model coefficient:", model.coef_)
print(f"Prob. of passing after 2.2 hrs study: {probs[0]*100:.2f}%")
print(f"Prob. of passing after 4.5 hrs study: {probs[1]*100:.2f}%")
`,
    exerciseTask: "Use the model to estimate and print the passing probability for a student who studied for 2.8 hours. Is it above 50%?",
    packages: ["numpy", "scikit-learn"]
  },
  {
    id: "decision-trees",
    title: "Decision Trees",
    module: "Supervised Learning",
    summary: "Perform classification by recursively splitting data space.",
    theory: [
      { type: "header", content: "Introduction to Decision Trees" },
      { type: "paragraph", content: "A Decision Tree is a non-parametric supervised learning method used for classification and regression. The goal is to create a model that predicts the value of a target variable by learning simple decision rules inferred from the data features." },
      { type: "header", content: "Why We Need It" },
      { type: "paragraph", content: "Linear models struggle with non-linear relationships and interactions between features unless we manually engineer complex features. We need Decision Trees because they automatically discover non-linear boundaries by recursively splitting the feature space into homogeneous regions. They are highly intuitive and mimic human decision-making." },
      { type: "header", content: "How it Works" },
      { type: "paragraph", content: "At each node, the tree searches for the feature and split threshold that maximizes the purity of the resulting child nodes. We measure impurity using Entropy:" },
      { type: "math", content: "H(S) = - \\sum_{c} p_c \\log_2(p_c)" },
      { type: "paragraph", content: "Information Gain (IG) measures the reduction in entropy after a split. The tree selects the split that yields the maximum IG:" },
      { type: "math", content: "IG(S, A) = H(S) - \\sum_{v \\in Values(A)} \\frac{|S_v|}{|S|} H(S_v)" }
    ],
    visualizer: "decision-tree",
    defaultCode: `import numpy as np
from sklearn.tree import DecisionTreeClassifier, export_text

# Let's create a dataset of points: [X1, X2] and labels (0 = Red, 1 = Blue)
# Red is generally bottom-left, Blue is top-right
X = np.array([
    [1.5, 1.5], [2.0, 1.0], [1.0, 2.0], [2.5, 2.0], # Class 0 (Red)
    [3.5, 3.5], [4.0, 3.0], [3.0, 4.0], [4.5, 4.0]  # Class 1 (Blue)
])
y = np.array([0, 0, 0, 0, 1, 1, 1, 1])

# Initialize Decision Tree Classifier
clf = DecisionTreeClassifier(max_depth=2, random_state=42)
clf.fit(X, y)

# Print out the text representation of the tree rules
tree_rules = export_text(clf, feature_names=["X-Coordinate", "Y-Coordinate"])
print("Decision Tree Rules:\n")
print(tree_rules)
`,
    exerciseTask: "Change the max_depth parameter of DecisionTreeClassifier to 1. Run the code and see how the tree rules simplify, showing only a single split.",
    packages: ["numpy", "scikit-learn"]
  },
  {
    id: "support-vector-machines",
    title: "Support Vector Machines (SVM)",
    module: "Supervised Learning",
    summary: "Maximize decision margins to separate complex classes.",
    theory: [
      { type: "header", content: "Introduction to SVM" },
      { type: "paragraph", content: "Support Vector Machines are classifiers that separate data using hyperplanes. They are particularly effective in high-dimensional spaces." },
      { type: "header", content: "Why We Need It" },
      { type: "paragraph", content: "Standard classifiers simply find any boundary that separates classes, which can leave the boundary very close to data points, making the model sensitive to noise. We need SVM to maximize the decision margin (the buffer space), which improves generalization. Furthermore, SVM's Kernel Trick allows it to solve complex, non-linear classification tasks without explicitly transforming data coordinates." },
      { type: "header", content: "How it Works" },
      { type: "paragraph", content: "SVM finds a hyperplane $w \\cdot x + b = 0$ that maximizes the distance to the nearest training points (support vectors) of any class:" },
      { type: "math", content: "\\min_{w, b} \\frac{1}{2} \\|w\\|^2 \\quad \\text{subject to} \\quad y_i(w \\cdot x_i + b) \\ge 1" },
      { type: "paragraph", content: "For non-linear boundaries, we map inputs to high-dimensional spaces using a Kernel Function (like RBF) to make them linearly separable:" },
      { type: "math", content: "K(x_i, x_j) = \\exp(-\\gamma \\|x_i - x_j\\|^2)" }
    ],
    visualizer: null,
    defaultCode: `import numpy as np
from sklearn.svm import SVC

# Non-linearly separable circle-like data: [X1, X2] and Label (0 = center, 1 = outer)
X = np.array([
    [0.0, 0.0], [0.1, -0.1], [-0.1, 0.1], # center (Class 0)
    [2.0, 2.0], [-2.0, -2.0], [2.0, -2.0], [-2.0, 2.0] # outer (Class 1)
])
y = np.array([0, 0, 0, 1, 1, 1, 1])

# Fit SVM with Radial Basis Function (RBF) kernel
clf = SVC(kernel='rbf', gamma='auto')
clf.fit(X, y)

# Predict class for a point at (0.2, 0.2) and (1.8, 1.8)
test_pts = np.array([[0.2, 0.2], [1.8, 1.8]])
preds = clf.predict(test_pts)

print("Support vectors determined by SVM:\n", clf.support_vectors_)
print(f"Prediction for (0.2, 0.2): Class {preds[0]} (Expected: 0)")
print(f"Prediction for (1.8, 1.8): Class {preds[1]} (Expected: 1)")
`,
    exerciseTask: "Train the SVC with a linear kernel (kernel='linear') instead of 'rbf'. Run the code and see if a linear separator fails on this concentric dataset (predictions for outer points will be wrong).",
    packages: ["numpy", "scikit-learn"]
  },
  {
    id: "k-means",
    title: "K-Means Clustering",
    module: "Unsupervised Learning",
    summary: "Discover hidden patterns and cluster unlabeled data.",
    theory: [
      { type: "header", content: "Introduction to K-Means" },
      { type: "paragraph", content: "K-Means is an unsupervised clustering algorithm that groups data points into K clusters based on feature similarity." },
      { type: "header", content: "Why We Need It" },
      { type: "paragraph", content: "In many real-world scenarios, we do not have labeled target data (e.g. customer segmentation, anomaly detection, image compression). We need K-Means to automatically discover hidden structures and groupings by analyzing the distances between data points, partitioning the dataset into cohesive clusters." },
      { type: "header", content: "How it Works" },
      { type: "paragraph", content: "The algorithm starts by placing K centroids at random locations, and then repeats two steps until centroids stop shifting:" },
      { type: "paragraph", content: "1. Assignment Step: Assign each data point $x_i$ to its nearest centroid $c_j$ based on Euclidean distance:" },
      { type: "math", content: "d(x_i, c_j) = \\sqrt{\\sum (x_{ik} - c_{jk})^2}" },
      { type: "paragraph", content: "2. Update Step: Re-calculate the position of each centroid as the average (mean) coordinate of all points assigned to it:" },
      { type: "math", content: "c_j = \\frac{1}{|S_j|} \\sum_{x_i \\in S_j} x_i" }
    ],
    visualizer: "k-means",
    defaultCode: `import numpy as np
from sklearn.cluster import KMeans

# 2D coordinate points
X = np.array([
    [1.0, 1.5], [1.2, 1.8], [1.8, 1.6],  # Group 1
    [5.0, 8.0], [5.5, 8.5], [6.0, 8.2],  # Group 2
    [9.0, 1.0], [8.8, 1.5], [9.2, 1.2]   # Group 3
])

# Initialize K-Means with 3 clusters
kmeans = KMeans(n_clusters=3, init='random', n_init=10, random_state=42)
kmeans.fit(X)

print("Final Centroids determined by K-Means:")
print(kmeans.cluster_centers_)

print("\nCluster assignment index for each input coordinate:")
for pt, label in zip(X, kmeans.labels_):
    print(f"Point {pt} => Cluster #{label}")
`,
    exerciseTask: "Try modifying some of the points in array X, or run K-Means with n_clusters=2. Observe how the assignments change.",
    packages: ["numpy", "scikit-learn"]
  },
  {
    id: "pca",
    title: "Principal Component Analysis (PCA)",
    module: "Unsupervised Learning",
    summary: "Reduce dimensions and preserve maximum variance of datasets.",
    theory: [
      { type: "header", content: "Introduction to PCA" },
      { type: "paragraph", content: "PCA is a dimensionality reduction method that converts a set of correlated variables into a set of values of linearly uncorrelated variables called principal components." },
      { type: "header", content: "Why We Need It" },
      { type: "paragraph", content: "High-dimensional data (e.g. datasets with hundreds of features) causes overfitting, increases training times, and makes data visualization impossible (this is the Curse of Dimensionality). We need PCA to project data onto a lower-dimensional subspace while minimizing information loss by retaining the axes that contain the maximum variance." },
      { type: "header", content: "How it Works" },
      { type: "paragraph", content: "PCA centers the dataset by subtracting the mean of each feature, and then calculates the Covariance Matrix:" },
      { type: "math", content: "\\Sigma = \\frac{1}{N} X^T X" },
      { type: "paragraph", content: "We compute the eigenvalues and eigenvectors of this matrix. The eigenvectors (principal components) indicate the directions of the new projection axes, while the eigenvalues indicate the variance explained along each axis:" },
      { type: "math", content: "\\Sigma v_i = \\lambda_i v_i" }
    ],
    visualizer: null,
    defaultCode: `import numpy as np
from sklearn.decomposition import PCA

# 4D data points (e.g. Size, Weight, Age, Rating of 6 items)
X = np.array([
    [5.1, 3.5, 1.4, 0.2],
    [4.9, 3.0, 1.4, 0.2],
    [7.0, 3.2, 4.7, 1.4],
    [6.4, 3.2, 4.5, 1.5],
    [6.3, 3.3, 6.0, 2.5],
    [5.8, 2.7, 5.1, 1.9]
])

# Initialize PCA to reduce from 4D to 2D
pca = PCA(n_components=2)
X_reduced = pca.fit_transform(X)

print("Explained variance ratio per component:", pca.explained_variance_ratio_)
print("Cumulative explained variance:", np.sum(pca.explained_variance_ratio_))
print("\nReduced 2D coordinates:\n", X_reduced)
`,
    exerciseTask: "Modify the PCA to output 1 component (n_components=1). Run the code and check the explained variance ratio of this single dominant principal component.",
    packages: ["numpy", "scikit-learn"]
  },
  {
    id: "genetic-algorithms",
    title: "Genetic Algorithms",
    module: "Unsupervised Learning",
    summary: "Optimize parameters using simulated Darwinian natural selection.",
    theory: [
      { type: "header", content: "Introduction to Genetic Algorithms" },
      { type: "paragraph", content: "A Genetic Algorithm (GA) is a search heuristic inspired by Charles Darwin's theory of natural evolution. This algorithm reflects the process of natural selection where the fittest individuals are selected for reproduction in order to produce offspring of the next generation." },
      { type: "header", content: "Why We Need It" },
      { type: "paragraph", content: "Gradient Descent works beautifully when our loss function is differentiable. However, in many real-world optimization tasks, the parameters are discrete, the search space has many local minima, or we cannot write down a mathematical equation for the loss (making derivatives impossible to compute). We need Genetic Algorithms to optimize these complex, non-differentiable systems by simulating genetic mutation, crossover, and survival of the fittest." },
      { type: "header", content: "How it Works" },
      { type: "paragraph", content: "The algorithm repeats a cycle of operations over generations:" },
      { type: "paragraph", content: "1. Initialization: Create a random population of candidate solutions (chromosomes)." },
      { type: "paragraph", content: "2. Fitness Evaluation: Assess how well each chromosome solves the problem using a Fitness Function." },
      { type: "paragraph", content: "3. Selection: Select parent chromosomes for reproduction, giving higher probabilities to individuals with higher fitness values (e.g. Roulette Wheel Selection)." },
      { type: "paragraph", content: "4. Crossover (Recombination): Combine sections of parent chromosomes to create offspring:" },
      { type: "math", content: "\\text{Offspring} = \\text{Parent}_1[0:k] + \\text{Parent}_2[k:n]" },
      { type: "paragraph", content: "5. Mutation: Introduce small, random changes (genes flipping) to maintain genetic diversity and prevent premature convergence." }
    ],
    visualizer: null,
    defaultCode: `import random

# Target binary string we want to evolve (e.g., password '10101010')
TARGET = [1, 0, 1, 0, 1, 0, 1, 0]
GENE_LENGTH = len(TARGET)
POPULATION_SIZE = 12
MUTATION_RATE = 0.1
GENERATIONS = 40

# Fitness function: number of matching bits
def get_fitness(chromosome):
    return sum(1 for c, t in zip(chromosome, TARGET) if c == t)

# Initialize population randomly
population = [[random.choice([0, 1]) for _ in range(GENE_LENGTH)] for _ in range(POPULATION_SIZE)]

print("Starting Evolution...")
for gen in range(GENERATIONS):
    # Sort population by fitness in descending order
    population = sorted(population, key=get_fitness, reverse=True)
    best = population[0]
    best_fitness = get_fitness(best)
    
    if gen % 5 == 0 or best_fitness == GENE_LENGTH:
        print(f"Gen {gen:02d}: Best solution: {best} | Fitness: {best_fitness}/{GENE_LENGTH}")
        
    if best_fitness == GENE_LENGTH:
        print(f"\nTarget reached at generation {gen}!")
        break
        
    # Generate new population
    next_population = population[:2] # Elitist selection: keep top 2
    
    while len(next_population) < POPULATION_SIZE:
        # Simple selection (pick from top half)
        p1 = random.choice(population[:POPULATION_SIZE//2])
        p2 = random.choice(population[:POPULATION_SIZE//2])
        
        # Crossover (single point split)
        split = random.randint(1, GENE_LENGTH - 1)
        child = p1[:split] + p2[split:]
        
        # Mutation
        child = [gene if random.random() > MUTATION_RATE else (1 - gene) for gene in child]
        next_population.append(child)
        
    population = next_population
`,
    exerciseTask: "Change the TARGET variable in the Python code to a longer 10-bit binary array (e.g. [1, 1, 1, 1, 0, 0, 0, 0, 1, 1]). Run the code and see if the population still evolves to match it.",
    packages: []
  },
  {
    id: "neural-networks",
    title: "Neural Networks & Backpropagation",
    module: "Deep Learning",
    summary: "Unlock the secrets of multi-layered artificial networks.",
    theory: [
      { type: "header", content: "Introduction to Neural Networks" },
      { type: "paragraph", content: "Artificial Neural Networks (ANNs) are computing systems inspired by the biological neural networks that constitute animal brains." },
      { type: "header", content: "Why We Need It" },
      { type: "paragraph", content: "Simple models like Linear and Logistic Regression can only fit linear relationships. We need multi-layer neural networks (Deep Learning) because they act as universal function approximators. By stacking hidden layers and using non-linear activation functions (like ReLU or Sigmoid), neural networks can model highly complex, high-dimensional datasets (like speech, images, and text)." },
      { type: "header", content: "How it Works" },
      { type: "paragraph", content: "A neural layer computes a linear transformation of inputs followed by a non-linear activation function σ:" },
      { type: "math", content: "z^{[l]} = W^{[l]} \\cdot a^{[l-1]} + b^{[l]}" },
      { type: "math", content: "a^{[l]} = \\sigma(z^{[l]})" },
      { type: "paragraph", content: "To train the network, we calculate predictions (Forward Propagation), measure the loss, and propagate the error backward using the calculus Chain Rule (Backpropagation) to calculate gradients for every single weight. We then update all weights in parallel:" },
      { type: "math", content: "\\frac{\\partial Loss}{\\partial W^{[l]}} = \\frac{\\partial Loss}{\\partial z^{[l]}} \\cdot (a^{[l-1]})^T" }
    ],
    visualizer: null,
    defaultCode: `import numpy as np

# A simple Feedforward Neural Network from scratch for the XOR problem
# XOR: 0,0->0;  0,1->1;  1,0->1;  1,1->0

# Sigmoid activation function and its derivative
def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def sigmoid_derivative(x):
    return x * (1 - x)

# Inputs and labels
X = np.array([[0,0], [0,1], [1,0], [1,1]])
y = np.array([[0], [1], [1], [0]])

np.random.seed(1)
# Random weights initialization
# Inputs: 2, Hidden layer: 3, Output: 1
weights_h = np.random.uniform(size=(2, 3))
weights_o = np.random.uniform(size=(3, 1))

# Training loop
epochs = 5000
learning_rate = 0.5

for epoch in range(epochs):
    # Forward propagation
    hidden_input = np.dot(X, weights_h)
    hidden_output = sigmoid(hidden_input)
    
    final_input = np.dot(hidden_output, weights_o)
    predicted_output = sigmoid(final_input)
    
    # Backward propagation (Calculate error gradients)
    error = y - predicted_output
    d_predicted_output = error * sigmoid_derivative(predicted_output)
    
    error_hidden = d_predicted_output.dot(weights_o.T)
    d_hidden_output = error_hidden * sigmoid_derivative(hidden_output)
    
    # Update weights
    weights_o += hidden_output.T.dot(d_predicted_output) * learning_rate
    weights_h += X.T.dot(d_hidden_output) * learning_rate

print("Outputs predicted by from-scratch Neural Network:")
print(predicted_output)
`,
    exerciseTask: "Run the training script for XOR. Look at the predicted outputs after 5000 epochs. Are they close to the target XOR outputs [0, 1, 1, 0]?",
    packages: ["numpy"]
  },
  {
    id: "cnn",
    title: "Convolutional Neural Networks (CNNs)",
    module: "Deep Learning",
    summary: "Extract spatial grid features for image and grid computer vision.",
    theory: [
      { type: "header", content: "Introduction to CNNs" },
      { type: "paragraph", content: "CNNs are specialized neural network structures designed to process grid-structured data like images." },
      { type: "header", content: "Why We Need It" },
      { type: "paragraph", content: "Standard neural networks flatten images into a 1D vector. If an image is 1000x1000 pixels, this generates 1 million inputs, requiring millions of weights for a single neuron, which leads to immediate overfitting. Furthermore, flattening destroys all 2D spatial relationships. We need CNNs because they slide small filters across the image to detect local features (like edges and curves) in a translation-invariant manner, drastically reducing the number of weights." },
      { type: "header", content: "How it Works" },
      { type: "paragraph", content: "The convolution layer applies a sliding filter (kernel) K over the image matrix I to compute feature activation maps S:" },
      { type: "math", content: "S(i, j) = (I * K)(i, j) = \\sum_{m} \\sum_{n} I(i-m, j-n) K(m, n)" },
      { type: "paragraph", content: "After convolution, a Pooling Layer (like Max Pooling) reduces the spatial dimensions by taking the maximum value in sub-regions, keeping only the most dominant features." }
    ],
    visualizer: null,
    defaultCode: `import numpy as np

# Create a 5x5 grayscale image representing a vertical edge (light left, dark right)
image = np.array([
    [10, 10, 0, 0, 0],
    [10, 10, 0, 0, 0],
    [10, 10, 0, 0, 0],
    [10, 10, 0, 0, 0],
    [10, 10, 0, 0, 0]
])

# Define a 3x3 Sobel vertical edge filter/kernel
kernel = np.array([
    [1, 0, -1],
    [2, 0, -2],
    [1, 0, -1]
])

# Simple valid 2D convolution function
def convolve2d(img, kern):
    i_h, i_w = img.shape
    k_h, k_w = kern.shape
    out_h = i_h - k_h + 1
    out_w = i_w - k_w + 1
    output = np.zeros((out_h, out_w))
    
    for y in range(out_h):
        for x in range(out_w):
            slice_area = img[y:y+k_h, x:x+k_w]
            output[y, x] = np.sum(slice_area * kern)
    return output

edge_map = convolve2d(image, kernel)
print("Input Grayscale Image (5x5):\n", image)
print("\nOutput Edge Activation Map (3x3):\n", edge_map)
`,
    exerciseTask: "Modify the kernel to detect horizontal edges instead: [[1, 2, 1], [0, 0, 0], [-1, -2, -1]]. Change the input image to have a horizontal edge (top rows 10, bottom rows 0). Run the code.",
    packages: ["numpy"]
  },
  {
    id: "q-learning",
    title: "Q-Learning",
    module: "Reinforcement Learning",
    summary: "Train an autonomous agent to take actions through rewards.",
    theory: [
      { type: "header", content: "Introduction to Reinforcement Learning" },
      { type: "paragraph", content: "Reinforcement Learning models how an autonomous agent can learn to make decisions through trial and error by interacting with an environment." },
      { type: "header", content: "Why We Need It" },
      { type: "paragraph", content: "Supervised models require millions of labeled examples. However, in many tasks (like playing games, robotics, or autonomous driving), there is no 'correct label' for every second. We need Reinforcement Learning (and Q-Learning) to let an agent discover policies by exploring actions and receiving positive or negative rewards, optimizing long-term cumulative gain." },
      { type: "header", content: "How it Works" },
      { type: "paragraph", content: "Q-Learning maintains a Q-Table that stores the expected cumulative reward Q(s, a) of taking action a in state s. We update Q-values using the Bellman Equation:" },
      { type: "math", content: "Q(s, a) \\leftarrow Q(s, a) + \\alpha \\left[ R + \\gamma \\max_{a'} Q(s', a') - Q(s, a) \\right]" },
      { type: "paragraph", content: "Where:" },
      { type: "list", content: [
        "α (alpha) is the learning rate.",
        "γ (gamma) is the discount factor for future rewards.",
        "R is the immediate reward received after performing the action.",
        "s' is the new state, and a' represents candidate actions in that state."
      ] }
    ],
    visualizer: null,
    defaultCode: `import numpy as np
import random

# Simple Q-learning simulation in a 1D line world of size 5: [Start, 0, 0, 0, Goal]
# States: 0, 1, 2, 3, 4 (Goal is 4)
# Actions: 0 = Move Left, 1 = Move Right

num_states = 5
num_actions = 2
Q = np.zeros((num_states, num_actions))

# Hyperparameters
alpha = 0.1
gamma = 0.9
epsilon = 0.2
epochs = 500

for epoch in range(epochs):
    state = 0 # always start at 0
    while state < 4:
        # epsilon-greedy choice
        if random.uniform(0, 1) < epsilon:
            action = random.choice([0, 1])
        else:
            action = np.argmax(Q[state])
            
        # Execute action
        if action == 1: # Move Right
            next_state = state + 1
        else: # Move Left
            next_state = max(0, state - 1)
            
        # Reward function
        reward = 10 if next_state == 4 else -1
        
        # Bellman update
        Q[state, action] = Q[state, action] + alpha * (reward + gamma * np.max(Q[next_state]) - Q[state, action])
        state = next_state

print("Trained Q-Table (States x [Move Left, Move Right]):")
print(Q)
print("\nOptimal policy: (0 = Left, 1 = Right)")
for s in range(4):
    print(f"State {s} => Best action: {'Move Right' if np.argmax(Q[s]) == 1 else 'Move Left'}")
`,
    exerciseTask: "Examine the trained Q-Table. Verify that for all states, the value for 'Move Right' (index 1) is higher than 'Move Left' (index 0). Change the goal state reward to 100 and observe changes.",
    packages: ["numpy"]
  }
];
