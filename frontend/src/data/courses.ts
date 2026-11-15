import { StudentCourseProgress, UnitPage } from '../types';

export const INITIAL_PROGRESS: StudentCourseProgress[] = [
  {
    unit_id: 1,
    title: 'Unit 2: Linear models',
    total_pages: 25,
    viewed_pages: 25,
    completion_percentage: 100,
    status: 'Review',
  },
  {
    unit_id: 2,
    title: 'Unit 3: Regularization',
    total_pages: 25,
    viewed_pages: 18,
    completion_percentage: 72,
    status: 'Continue reading',
  },
  {
    unit_id: 3,
    title: 'Unit 4: Neural networks',
    total_pages: 30,
    viewed_pages: 0,
    completion_percentage: 0,
    status: 'Start reading',
  },
];

export const UNIT_3_PAGES: UnitPage[] = [
  {
    id: 1,
    page_number: 1,
    title: 'Ill-Conditioned Inverse Problems',
    key_concept: 'Ill-Conditioned Covariance Matrices',
    estimated_reading_sec: 45,
    content: `When predictor dimensions approach or exceed observations (p >= n), sample covariance matrices X^T X degenerate into rank-deficient or ill-conditioned operators. Small measurement perturbations in targets produce catastrophic fluctuations in ordinary least squares estimators. Regularization acts as a spectral damping filter, shifting eigenvalues away from singularity.`
  },
  {
    id: 2,
    page_number: 2,
    title: 'Polynomial Overfitting & Variance Explosion',
    key_concept: 'Empirical vs Generalization Risk',
    estimated_reading_sec: 50,
    content: `A degree-14 polynomial fits 15 training points with zero empirical loss, yet oscillates wildly between nodes. Runge's phenomenon illustrates why minimizing empirical risk without hypothesis class complexity controls leads to catastrophic generalization error.`
  },
  {
    id: 3,
    page_number: 3,
    title: 'Geometry of the Residual Sum of Squares',
    key_concept: 'Convex Paraboloid Level Sets',
    estimated_reading_sec: 40,
    content: `The OLS loss surfaces are concentric hyper-ellipsoids centered at w_ols. The principal axes align with the eigenvectors of X^T X, and their elongation reflects the condition number. Regularization intersects these ellipses with constrained geometric balls.`
  },
  {
    id: 4,
    page_number: 4,
    title: 'Norms as Metric Complexity Constraints',
    key_concept: 'L_p Vector Norm Formulations',
    estimated_reading_sec: 35,
    content: `We formalize model complexity by constraining the parameter vector within an L_p ball: ||w||_p = (sum |w_i|^p)^(1/p). When p=2 we obtain the Euclidean ball; when p=1 we obtain the cross-polytope (diamond); when p->0 we count non-zero coordinates.`
  },
  {
    id: 5,
    page_number: 5,
    title: 'Ridge Regression (L2) Formulation',
    key_concept: 'Tikhonov Regularization',
    estimated_reading_sec: 60,
    content: `Ridge regression adds a quadratic penalty on weight magnitudes: J(w) = ||y - Xw||^2 + lambda * ||w||_2^2. The tuning parameter lambda >= 0 controls the tradeoff between data fidelity and weight contraction toward the origin.`
  },
  {
    id: 6,
    page_number: 6,
    title: 'Analytical Solution of Ridge Regression',
    key_concept: 'Closed-Form Matrix Inverse',
    estimated_reading_sec: 50,
    content: `Setting the gradient to zero yields: w_ridge = (X^T X + lambda * I)^(-1) X^T y. Because lambda > 0, the matrix (X^T X + lambda * I) is strictly positive definite and invertible even when X is rank-deficient.`
  },
  {
    id: 7,
    page_number: 7,
    title: 'Singular Value Decomposition Analysis',
    key_concept: 'Spectral Shrinkage Factor',
    estimated_reading_sec: 55,
    content: `Using SVD X = U Sigma V^T, Ridge weights decompose as: w_ridge = sum (sigma_j / (sigma_j^2 + lambda)) u_j^T y * v_j. Directions with small singular values (high variance noise) are suppressed by factor sigma_j^2 / (sigma_j^2 + lambda).`
  },
  {
    id: 8,
    page_number: 8,
    title: 'Bias-Variance Tradeoff in L2 Penalties',
    key_concept: 'Mean Squared Error Decomposition',
    estimated_reading_sec: 70,
    content: `While w_ols is unbiased (Bias = 0), its variance can be enormous when predictors are correlated. Ridge introduces a controllable bias in exchange for a quadratic reduction in estimator variance, substantially decreasing expected test MSE.`
  },
  {
    id: 9,
    page_number: 9,
    title: 'Lasso Regression (L1) Introduction',
    key_concept: 'Least Absolute Shrinkage and Selection',
    estimated_reading_sec: 85,
    content: `Proposed by Robert Tibshirani (1996), Lasso minimizes: J(w) = 0.5 * ||y - Xw||^2 + lambda * ||w||_1. Unlike Ridge, Lasso performs both continuous coefficient shrinkage and automated feature selection by driving non-informative weights to exactly zero.`
  },
  {
    id: 10,
    page_number: 10,
    title: 'Subgradient Calculus for Non-Smooth Penalties',
    key_concept: 'Subdifferentials at the Origin',
    estimated_reading_sec: 95,
    content: `Because the absolute value function is not differentiable at zero, classical gradient descent fails. We utilize the subdifferential partial |w_i| = sign(w_i) for w_i != 0 and [-1, 1] for w_i = 0, leading to directional optimality conditions.`
  },
  {
    id: 11,
    page_number: 11,
    title: 'Coordinate Descent & Soft Thresholding',
    key_concept: 'Iterative Soft-Thresholding (ISTA)',
    estimated_reading_sec: 110,
    content: `Lasso optimization decomposes into univariate soft-thresholding operators: S(z, lambda) = sign(z) * max(0, |z| - lambda). Coordinate descent cycles through parameters one at a time, achieving rapid convergence on sparse high-dimensional data.`
  },
  {
    id: 12,
    page_number: 12,
    title: 'Geometric Contours: Diamond vs Sphere',
    key_concept: 'Corner Intersections & Sparsity',
    estimated_reading_sec: 155,
    content: `In 2D parameter space, the L1 constraint region is a rotated square (diamond) with sharp vertices along coordinate axes w_1 = 0 and w_2 = 0. The elliptical loss contour expands until it touches the constraint region. Due to the sharp corners, contact occurs with overwhelming probability at an axis vertex, setting the adjacent parameter to zero.`
  },
  {
    id: 13,
    page_number: 13,
    title: 'KKT Optimality & Sparsity Proof',
    key_concept: 'Karush-Kuhn-Tucker Conditions',
    estimated_reading_sec: 165,
    content: `Formulating the Lagrangian L(w, lambda) = 0.5 * ||y - Xw||^2 + lambda * sum |w_j|, the KKT stationarity requires: -X_j^T (y - Xw) + lambda * s_j = 0 where s_j in subdifferential of |w_j|. When the empirical correlation |X_j^T r| < lambda, w_j must equal 0.`
  },
  {
    id: 14,
    page_number: 14,
    title: 'Rotational Invariance vs Feature Selection',
    key_concept: 'Coordinate Orthogonality',
    estimated_reading_sec: 160,
    content: `Ridge regression is rotationally invariant: rotating the feature coordinate system simply rotates the weight vector without changing predictions. Lasso is explicitly NOT rotationally invariant; its coordinate bias is precisely what drives sparse selection along measured feature axes.`
  },
  {
    id: 15,
    page_number: 15,
    title: 'ElasticNet: Bridging L1 and L2',
    key_concept: 'Convex Combination Penalty',
    estimated_reading_sec: 170,
    content: `When features are strongly collinear, Lasso arbitrarily selects one and discards the rest. ElasticNet resolves this limitation via convex combination: J(w) = Loss + lambda_1 * ||w||_1 + lambda_2 * ||w||_2^2. The quadratic L2 term creates strictly convex contours that enforce a grouping effect among correlated predictors.`
  },
  {
    id: 16,
    page_number: 16,
    title: 'Collinear Grouping Lemma in ElasticNet',
    key_concept: 'Grouping Property Proof',
    estimated_reading_sec: 145,
    content: `Let features x_i and x_j be identical (sample correlation r = 1). In Lasso, solutions for w_i and w_j are non-unique. In ElasticNet, strict convexity guarantees a unique global minimum where w_i = w_j, preserving correlated feature clusters such as biological pathways.`
  },
  {
    id: 17,
    page_number: 17,
    title: 'Bayesian Interpretation of Regularization',
    key_concept: 'Prior Distributions over Weights',
    estimated_reading_sec: 140,
    content: `Regularized estimators are identical to Maximum A Posteriori (MAP) estimates under Bayesian inference. Ridge corresponds to independent Gaussian priors w_j ~ N(0, tau^2). Lasso corresponds to independent Laplacian (double exponential) priors w_j ~ Laplace(0, b) with sharp density peaks at zero.`
  },
  {
    id: 18,
    page_number: 18,
    title: 'MAP Estimation & Posterior Likelihood',
    key_concept: 'Log Posterior Maximization',
    estimated_reading_sec: 135,
    content: `Maximizing log p(w|D) = log p(D|w) + log p(w) - log p(D). Under Gaussian likelihood and Laplace prior, the negative log posterior equals 0.5/sigma^2 * ||y - Xw||^2 + 1/b * ||w||_1, proving lambda = sigma^2 / b directly links observational noise to shrinkage.`
  },
  {
    id: 19,
    page_number: 19,
    title: 'Hyperparameter Tuning & Cross-Validation',
    key_concept: 'K-Fold Grid Search & 1-SE Rule',
    estimated_reading_sec: 75,
    content: `Lambda cannot be optimized on training data because lambda=0 always minimizes empirical training loss. We evaluate validation error curves across logarithmic grids and apply the 'One Standard Error Rule' to favor simpler, more regularized models within sampling variance.`
  },
  {
    id: 20,
    page_number: 20,
    title: 'Regularization Paths & LARS Algorithm',
    key_concept: 'Least Angle Regression',
    estimated_reading_sec: 60,
    content: `The piecewise-linear nature of Lasso coefficient paths enables the LARS algorithm to trace the entire regularization path for all lambda in O(p^3) operations—the exact computational cost of a single OLS fit.`
  },
  {
    id: 21,
    page_number: 21,
    title: 'The Critical Necessity of Feature Standardization',
    key_concept: 'Centering and Unit Variance',
    estimated_reading_sec: 35,
    content: `Because penalty terms penalize absolute magnitude sum |w_j|, predictors with small units (e.g., distances in millimeters vs kilometers) will have huge coefficients and suffer disproportionate shrinkage. Always standardize features to zero mean and unit variance prior to penalization.`
  },
  {
    id: 22,
    page_number: 22,
    title: 'Regularization in Logistic Classification',
    key_concept: 'Preventing Linear Separation Divergence',
    estimated_reading_sec: 30,
    content: `In linearly separable binary classification, maximum likelihood estimates diverge to infinity as sigmoid probabilities approach 1. L2 regularization caps weight growth, stabilizing decision boundaries and calibrated class probabilities.`
  },
  {
    id: 23,
    page_number: 23,
    title: 'Genomics Case Study: High-Dimensional Biomarkers',
    key_concept: 'p >> n Gene Expression Analysis',
    estimated_reading_sec: 25,
    content: `In leukemia classification (n=72 patients, p=7,129 gene probes), ordinary regression overfits instantly. ElasticNet selected 16 core biomarker genes achieving 98.6% cross-validated diagnostic accuracy while preserving regulatory gene clusters.`
  },
  {
    id: 24,
    page_number: 24,
    title: 'Architectural Rules: The Intercept Exception',
    key_concept: 'Preserving Baseline Target Shifts',
    estimated_reading_sec: 25,
    content: `Never penalize the intercept term w_0! Penalizing the intercept ties predictions to an arbitrary coordinate origin choice. Either center the target variable y beforehand (y_centered = y - mean(y)) or exclude w_0 from the norm penalty.`
  },
  {
    id: 25,
    page_number: 25,
    title: 'Summary & Midterm Concept Review',
    key_concept: 'Comparative Synthesis & Formula Sheet',
    estimated_reading_sec: 20,
    content: `Summary table comparing OLS, Ridge, Lasso, and ElasticNet across closed-form availability, sparsity, rotation invariance, and prior distributions. Key formulas for the CS3104 Midterm exam and practical rules of thumb.`
  }
];
