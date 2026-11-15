import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import AsyncSessionLocal, engine, Base
from app.models.user import User
from app.models.course import Course, CourseUnit, UnitPage
from app.models.telemetry import ReadingSession, PageTelemetry

async def seed_data():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # Check if already seeded
        res = await session.execute(select(Course).where(Course.code == "CS3104"))
        existing_course = res.scalar_one_or_none()
        if existing_course:
            print("Database already contains CS3104. Skipping seed.")
            return

        print("Seeding LearnTrack AI database...")

        # 1. Create Course
        course = Course(
            code="CS3104",
            name="Machine Learning",
            section="section A",
            description="Core undergraduate course covering supervised, unsupervised, and deep learning algorithms."
        )
        session.add(course)
        await session.flush()

        # 2. Create Units
        unit2 = CourseUnit(
            course_id=course.id,
            unit_number=2,
            title="Unit 2: Linear models",
            total_pages=25,
            assigned_date="28 Aug",
            description="Ordinary least squares, normal equations, gradient descent, and polynomial features."
        )
        unit3 = CourseUnit(
            course_id=course.id,
            unit_number=3,
            title="Unit 3: Regularization",
            total_pages=25,
            assigned_date="12 Sep",
            description="L1 Lasso, L2 Ridge, ElasticNet, geometric contours, and bias-variance tradeoff."
        )
        unit4 = CourseUnit(
            course_id=course.id,
            unit_number=4,
            title="Unit 4: Neural networks",
            total_pages=30,
            assigned_date="29 Sep",
            description="Multilayer perceptrons, backpropagation, activation functions, and computational graphs."
        )
        session.add_all([unit2, unit3, unit4])
        await session.flush()

        # 3. Create Pages for Unit 3
        unit3_page_topics = [
            ("Motivation: Ill-Conditioned Problems", "When feature count exceeds samples, covariance matrices become singular.", 45),
            ("Overfitting in Polynomial Regression", "Higher-degree polynomials fit noise rather than underlying signal.", 50),
            ("The Geometry of Loss Landscapes", "Convex paraboloids and the direction of steepest descent.", 40),
            ("Norms as Complexity Constraints", "p-norm formulations and distance metrics in parameter space.", 35),
            ("L2 Regularization (Ridge) Introduction", "Adding squared magnitude penalty to the loss function.", 60),
            ("Analytical Solution for Ridge", "Closed form (X^T X + lambda I)^(-1) X^T y ensures invertibility.", 50),
            ("Shrinkage Effect on Eigenvalues", "How ridge dampens directions with small eigenvalues.", 55),
            ("The Bias-Variance Tradeoff in Ridge", "Trading small bias for large variance reduction.", 70),
            ("L1 Regularization (Lasso) Introduction", "Absolute sum penalty producing exact feature sparsity.", 85),
            ("Subgradient Calculus for Non-Smooth Penalties", "Handling the non-differentiable singularity at w=0.", 95),
            ("Coordinate Descent for Lasso", "Iterative soft-thresholding algorithm derivation.", 110),
            ("Geometric Contours: L1 Diamond vs L2 Sphere", "Why corner intersections on axis boundaries cause zero weights.", 155),
            ("Proof of Feature Selection via L1 Norm", "Formal KKT condition analysis demonstrating sparse solution sets.", 165),
            ("Comparative Analysis: Ridge vs Lasso Sparsity", "Visualizing constraint boundaries under rotational transformations.", 160),
            ("ElasticNet: Blending L1 and L2 Penalties", "Combining convex grouping effect with sparse feature selection.", 170),
            ("Handling Collinear Features with ElasticNet", "How strictly convex L2 term groups correlated variables.", 145),
            ("Bayesian Interpretation of Regularization", "L2 as Gaussian prior; L1 as Laplacian prior on weights.", 140),
            ("Maximum A Posteriori (MAP) Estimation", "Connecting probabilistic modeling to penalized loss minimization.", 135),
            ("Selecting Lambda via Cross-Validation", "K-fold grid search and the one-standard-error rule.", 75),
            ("Regularization Paths and LARS Algorithm", "Tracing weight trajectories as lambda varies from inf to 0.", 60),
            ("Impact on Feature Scaling and Normalization", "Why standardize features to zero mean and unit variance first.", 35),
            ("Regularization in Logistic Regression", "Preventing infinite weights in linearly separable classification.", 30),
            ("Case Study: Gene Expression Microarrays", "Selecting 15 relevant biomarkers out of 20,000 candidate genes.", 25),
            ("Common Pitfalls and Regularizing the Intercept", "Why the bias term w_0 must never be penalized.", 25),
            ("Summary and Midterm Review Checkpoints", "Core takeaways, formula sheet, and practice exam problems.", 20)
        ]

        pages = []
        for idx, (title, summary, est_sec) in enumerate(unit3_page_topics):
            content_text = (
                f"## {title}\n\n"
                f"{summary}\n\n"
                "### Key Theoretical Principles\n"
                "In this section, we study how controlling parameter norms bounds the generalization error. "
                "Let the objective be J(w) = 0.5 * ||Xw - y||^2 + lambda * Omega(w). "
                "When lambda > 0, the penalty introduces shrinkage towards zero, penalizing high curvature "
                "decision surfaces and dampening collinear predictor sensitivity.\n\n"
                "### Mathematical Note\n"
                "Recall that the condition number kappa(X^T X) measures sensitivity to perturbations. "
                "By augmenting the diagonal with lambda * I, kappa(X^T X + lambda * I) < kappa(X^T X), "
                "guaranteeing numerical stability during gradient steps."
            )
            page = UnitPage(
                unit_id=unit3.id,
                page_number=idx + 1,
                title=f"Page {idx+1}: {title}",
                content=content_text,
                key_concept=title,
                estimated_reading_sec=est_sec
            )
            pages.append(page)
        session.add_all(pages)
        await session.flush()

        # 4. Create Users (1 Faculty, 12 Students matching prototype)
        faculty = User(
            email="name@college.edu",
            full_name="Prof. Sarah Jenkins",
            role="faculty",
            hashed_password="hashed_demo_password"
        )
        session.add(faculty)

        student_specs = [
            ("Sejal Srivastava", "sejalsriv2005@gmail.com", 100, 52, 4),
            ("Diya Sharma", "diya@college.edu", 96, 47, 6),
            ("Kabir Nair", "kabir@college.edu", 84, 41, 3),
            ("Ishita Rao", "ishita@college.edu", 72, 36, 2),
            ("Rohan Verma", "rohan@college.edu", 68, 33, 1),
            ("Ananya Iyer", "ananya@college.edu", 64, 30, 3),
            ("Vihaan Gupta", "vihaan@college.edu", 40, 18, 0),
            ("Meera Joshi", "meera@college.edu", 32, 12, 0),
            ("Arjun Singh", "arjun@college.edu", 28, 9, 1),
            ("Sana Khan", "sana@college.edu", 100, 4, 0),
            ("Dev Patel", "dev@college.edu", 88, 39, 14),
            ("Riya Das", "riya@college.edu", 76, 35, 2)
        ]

        created_students = []
        for name, email, pct, mins, revisits in student_specs:
            student = User(
                email=email,
                full_name=name,
                role="student",
                hashed_password="hashed_demo_password"
            )
            session.add(student)
            created_students.append((student, pct, mins, revisits))

        await session.flush()

        # 5. Create Sessions & Page Telemetry for each student
        baseline_dwell = [
            40, 52, 36, 30, 58, 46, 50, 66, 80, 92,
            104, 150, 162, 158, 170, 144, 138, 132, 70, 56,
            32, 26, 20, 24, 16
        ]

        for s_user, pct, active_m, total_revisits in created_students:
            pages_read = int(round(pct * 25 / 100))
            sess = ReadingSession(
                student_id=s_user.id,
                unit_id=unit3.id,
                total_active_seconds=active_m * 60,
                completed_pages=pages_read,
                is_completed=(pct >= 100)
            )
            session.add(sess)

            for p in range(1, pages_read + 1):
                raw_dwell = baseline_dwell[p - 1]
                scale = (active_m / 38.0) if active_m > 0 else 0.5
                p_dwell = max(5.0, raw_dwell * scale)
                p_rev = 1 if (total_revisits > 0 and p in [12, 13, 14, 15]) else 0
                if total_revisits > 10 and p in [12, 13, 14, 15, 16]:
                    p_rev = total_revisits // 5

                pt = PageTelemetry(
                    student_id=s_user.id,
                    unit_id=unit3.id,
                    page_number=p,
                    dwell_seconds=p_dwell,
                    revisits_count=p_rev
                )
                session.add(pt)

        await session.commit()
        print("Database seeded successfully with courses, units, pages, and realistic telemetry!")

if __name__ == "__main__":
    asyncio.run(seed_data())
