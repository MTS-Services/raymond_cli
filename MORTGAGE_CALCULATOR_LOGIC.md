# Mortgage Calculator Logic

## 1. Core Formula — `calcPMT(principal, annualRatePct, termYears)`

Standard mortgage **PMT** (monthly principal & interest payment):

$$r = \frac{\text{annualRate\%}}{100 \times 12}$$

$$n = \text{termYears} \times 12$$

$$\text{PMT} = \frac{P \cdot r \cdot (1+r)^n}{(1+r)^n - 1}$$

| Edge Case                  | Behavior              |
| -------------------------- | --------------------- |
| `r = 0` (0% interest)      | `PMT = principal / n` |
| `principal ≤ 0` or `n = 0` | Returns `0`           |

---

## 2. Mortgage Calculator (Purchase)

**Inputs:** Purchase Amount, Down Payment, Interest Rate (%), Loan Term (years)

```
loanAmount     = purchaseAmount − downPayment
PI             = calcPMT(loanAmount, interestRate, loanTerm)
propertyTax    = (purchaseAmount × 0.01) / 12     ← 1% annual / 12
homeInsurance  = $150.00  (flat monthly)
──────────────────────────────────────────────────
totalMonthly   = PI + propertyTax + homeInsurance
```

**Example with defaults:**

| Field           | Value          |
| --------------- | -------------- |
| Purchase Amount | $800,000       |
| Down Payment    | $160,000 (20%) |
| Loan Amount     | $640,000       |
| Interest Rate   | 6.5%           |
| Loan Term       | 30 years       |

```
r   = 6.5 / (100 × 12)  = 0.005417
n   = 30 × 12            = 360
PI  = (640000 × 0.005417 × 1.005417^360) / (1.005417^360 − 1)
    ≈ $4,046.55 / mo

Tax      = (800000 × 0.01) / 12  = $666.67 / mo
Insurance = $150.00 / mo
─────────────────────────────────
Total     ≈ $4,863.22 / mo
```

---

## 3. Refinance Calculator

**Inputs:** Loan Amount, Home Value, FICO Score (display only), Interest Rate (%), Loan Term (years)

```
PI             = calcPMT(loanAmount, interestRate, loanTerm)
propertyTax    = (homeValue × 0.01) / 12          ← 1% of home value / 12
homeInsurance  = $150.00  (flat monthly)
HOA            = $0.00    (flat monthly)
──────────────────────────────────────────────────
totalMonthly   = PI + propertyTax + homeInsurance + HOA
```

> **Key difference from Purchase:** tax base is `homeValue`, not `purchaseAmount`.  
> FICO score is collected for the application form but does **not** affect the calculation.

**Example with defaults:**

| Field         | Value              |
| ------------- | ------------------ |
| Loan Amount   | $800,000           |
| Home Value    | $1,000,000         |
| FICO          | 740 (display only) |
| Interest Rate | 6.5%               |
| Loan Term     | 30 years           |

```
PI        ≈ $5,058.19 / mo  (on $800K)
Tax        = (1,000,000 × 0.01) / 12  = $833.33 / mo
Insurance  = $150.00 / mo
HOA        = $0.00 / mo
─────────────────────────────────
Total      ≈ $6,041.52 / mo
```

---

## 4. Donut Chart — Breakdown

Each slice width = `(componentValue / totalMonthly) × circumference`

| Component              | Color  | Hex       |
| ---------------------- | ------ | --------- |
| Principal & Interest   | Blue   | `#1e3a8a` |
| Property Tax           | Orange | `#f97316` |
| Home Insurance         | Green  | `#10b981` |
| HOA _(refinance only)_ | Purple | `#8b5cf6` |

The chart uses an SVG with `strokeDasharray` / `strokeDashoffset` on stacked `<circle>` elements rotated `-90deg` so the first slice starts at 12 o'clock.

---

## 5. Currency Formatting — `fmtUSD(n)`

```
Input invalid (NaN / Infinity / negative) → "$0.00"
Otherwise → en-US locale currency, 2 decimal places
e.g.  4046.55  →  "$4,046.55"
```

---

## 6. Summary Table

| Variable  | Purchase Calc                  | Refinance Calc              |
| --------- | ------------------------------ | --------------------------- |
| PI base   | `purchaseAmount − downPayment` | `loanAmount` (direct input) |
| Tax base  | `purchaseAmount`               | `homeValue`                 |
| Insurance | $150 flat                      | $150 flat                   |
| HOA       | Not included                   | $0 flat                     |
| FICO      | Not used                       | Collected only              |
