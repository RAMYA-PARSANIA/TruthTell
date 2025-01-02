decompose_prompt = """
Break down this text into atomic claims. Each claim should be:
1. Concise (under 15 words)
2. Self-contained and context-independent 
3. Free from vague references (avoid he/she/it/this/the company)
4. Include at least one claim per sentence from the original text

Example:
Text: Mary is a five-year old girl, she likes playing piano and she doesn't like cookies.
Expected JSON Output:
{
    "claims": [
        "Mary is a five-year old girl.",
        "Mary likes playing piano.",
        "Mary doesn't like cookies."
    ]
}

Text: {doc}
Output:
"""

restore_prompt = """
Split this text into chunks that correspond to each derived fact. Each chunk should:
- Be a continuous span from the original text
- Contain the information needed to derive the fact
- When combined, reproduce the complete original text

Example:
Text: Mary is a five-year old girl, she likes playing piano and she doesn't like cookies.
Facts: ["Mary is a five-year old girl.", "Mary likes playing piano.", "Mary doesn't like cookies."]

Expected JSON Output:
{
    "Mary is a five-year old girl.": "Mary is a five-year old girl,",
    "Mary likes playing piano.": "she likes playing piano",
    "Mary doesn't like cookies.": "and she doesn't like cookies."
}

Text: {doc}
Facts: {claims}
Output:
"""

checkworthy_prompt = """
Evaluate each statement's factual verifiability. A statement is verifiable if:
1. It contains objective facts that can be checked against evidence
2. It has clear, specific references
3. It's not purely opinion-based

Respond with "Yes" or "No" for each statement, including a brief explanation.

Example statements:
1. Gary Smith is a distinguished professor of economics.
2. He is a professor at MBZUAI.
3. Obama is the president of the UK.

Expected JSON Output:
{
    "Gary Smith is a distinguished professor of economics.": "Yes (Contains verifiable information about title and field)",
    "He is a professor at MBZUAI.": "No (Unclear reference - who is 'he'?)",
    "Obama is the president of the UK.": "Yes (Contains verifiable political position claim)"
}

For these statements:
{texts}
Output:
"""

qgen_prompt = """
Create the minimum necessary questions to verify this claim's correctness.

Example:
Claim: The Stanford Prison Experiment was conducted in the basement of Encina Hall, Stanford's psychology building.
Expected JSON Output:
{
    "Questions": [
        "Where was Stanford Prison Experiment conducted?"
    ]
}

Claim: {claim}
Output:
"""

verify_prompt = """
Determine if the evidence supports, refutes, or is irrelevant to the claim.

Example:
[claim]: MBZUAI is located in Abu Dhabi, UAE.
[evidence]: Where is MBZUAI located?\nAnswer: Masdar City - Abu Dhabi - United Arab Emirates
Expected JSON Output:
{
    "reasoning": "The evidence confirms MBZUAI's location in Abu Dhabi, UAE",
    "relationship": "SUPPORTS"
}

[claim]: {claim}
[evidence]: {evidence}
Output:
"""

class LlamaPrompt:
    decompose_prompt = decompose_prompt
    restore_prompt = restore_prompt
    checkworthy_prompt = checkworthy_prompt
    qgen_prompt = qgen_prompt
    verify_prompt = verify_prompt
