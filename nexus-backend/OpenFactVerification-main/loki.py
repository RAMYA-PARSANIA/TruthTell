from factcheck import FactCheck

factcheck_instance = FactCheck()

# Example text
text = "There are 8 colors in the rainbow."

# Run the fact-check pipeline
results = factcheck_instance.check_text(text)
print(results)