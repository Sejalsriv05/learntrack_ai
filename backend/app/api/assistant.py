from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.course import UnitPage

router = APIRouter(prefix="/assistant", tags=["AI Reading Assistant"])

class AssistantQuery(BaseModel):
    unit_id: int
    page_number: int
    question: Optional[str] = None
    action: str = "explain"  # "explain", "summarize", "formula_breakdown"

class AssistantResponse(BaseModel):
    page_number: int
    concept: str
    response: str
    follow_up_prompts: list[str]

@router.post("/query", response_model=AssistantResponse)
async def query_ai_assistant(payload: AssistantQuery, db: AsyncSession = Depends(get_db)):
    stmt = select(UnitPage).where(
        UnitPage.unit_id == payload.unit_id,
        UnitPage.page_number == payload.page_number
    )
    res = await db.execute(stmt)
    page = res.scalar_one_or_none()

    concept = page.key_concept if page and page.key_concept else f"Page {payload.page_number} Material"
    page_text = page.content if page else ""

    if payload.action == "summarize":
        explanation = (
            f"**Key Takeaway (Page {payload.page_number})**:\n"
            f"This section discusses **{concept}**. In high-dimensional model fitting, unconstrained weights tend to "
            f"overfit training noise. Regularization introduces an inductive bias penalizing weight magnitudes, "
            f"balancing the empirical risk against hypothesis complexity."
        )
        follow_ups = [
            "Why does L1 cause sparsity while L2 doesn't?",
            "How do we choose hyperparameter lambda via cross-validation?",
            "What is the Bayesian interpretation of Ridge regression?"
        ]
    elif payload.action == "formula_breakdown":
        explanation = (
            f"**Mathematical Breakdown**:\n"
            r"The regularized objective is: $$\min_w \mathcal{L}_{MSE}(w) + \lambda \Omega(w)$$" + "\n\n"
            r"- **Empirical Loss**: $\frac{1}{2n}\sum (y_i - w^T x_i)^2$" + "\n"
            r"- **Penalty**: $\Omega(w) = \frac{1}{2}\|w\|_2^2$ for Ridge (L2), or $\|w\|_1$ for Lasso (L1)" + "\n"
            r"- **$\lambda$**: controls the shrinkage trade-off. As $\lambda \to \infty$, $w \to 0$."
        )
        follow_ups = [
            "Show the geometric contour explanation",
            "How does this affect gradient descent update steps?",
            "When should I prefer ElasticNet over pure Lasso?"
        ]
    else:
        # Default explain action
        question_text = f" regarding '{payload.question}'" if payload.question else ""
        explanation = (
            f"Here is a concept explanation for **{concept}**{question_text}:\n\n"
            f"In linear models, overfitting often manifests as wildly oscillating positive and negative coefficients. "
            f"By introducing a constraint on the norm of the weight vector, we keep the model simpler and smoother. "
            f"Notice how the error surfaces intersect with the constraint balls: the diamond-shaped L1 ball touches "
            f"the elliptical contours on coordinate axes, zeroing out non-essential features."
        )
        follow_ups = [
            "Summarize this page in 2 sentences",
            "Explain the difference between L1 diamond and L2 circle contours",
            "Give a real-world example in medical diagnosis"
        ]

    return AssistantResponse(
        page_number=payload.page_number,
        concept=concept,
        response=explanation,
        follow_up_prompts=follow_ups
    )
