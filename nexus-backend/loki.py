from Loki.factcheck import FactCheck

factcheck_instance = FactCheck()

# Example text
text = ["There are 7 colors in the rainbow.", "Allu Arjun is free of all allegations in the Sandhya Theatre incident", "Nirmala Sitaraman abolishes all GST and taxes additionally added."]

# Run the fact-check pipeline
results = factcheck_instance.check_text(text)
print(results["summary"]["factuality"])