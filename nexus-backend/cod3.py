import time
from politifact import Politifact
from difflib import SequenceMatcher

class LiveFactChecker:
    def __init__(self, cache_size = 1000):
        self.fact_checker = Politifact()
        self.cache = {}
        self.cache_size = cache_size
        
    def similarity_score(self, a, b):
        return SequenceMatcher(None, a.lower(), b.lower()).ratio()
    
    def check_statement(self, statement, similarity_threshold=0.7):
        try:
            # Check cache first
            if not statement or not isinstance(statement, str):
                return {"verified": False, "message": "Invalid input statement"}
            if not 0 <= similarity_threshold <= 1:
                similarity_threshold = 0.7
            for cached_statement, result in self.cache.items():
                if self.similarity_score(statement, cached_statement) > similarity_threshold:
                    return result
            
            # Search PolitiFact
            results = self.fact_checker.search(statement, limit=5)
            
            if len(results) == 0:
                return {"verified": False, "message": "No matching fact checks found"}
                
            # Find most similar statement
            similarities = [(self.similarity_score(statement, row['statement']), row) 
                        for _, row in results.iterrows()]
            best_match = max(similarities, key=lambda x: x[0])
            
            if best_match[0] < similarity_threshold:
                return {"verified": False, "message": "No similar fact checks found"}
                
            matched_statement = best_match[1]
            result = {
                "verified": True,
                "rating": matched_statement['rating'],
                "original_statement": matched_statement['statement'],
                "source": matched_statement['source'],
                "similarity": best_match[0]
            }
            
            # Cache the result
            self.cache[statement] = result
            return result
        except Exception as e:
                return {"verified": False, "message": str(e)}

    def continuous_check(self, statement_generator, delay=1):
        """For continuous fact checking of statements"""
        for statement in statement_generator:
            result = self.check_statement(statement)
            yield result
            time.sleep(delay)  # Configurable rate limiting


statement = "The Earth is flat."
checker = LiveFactChecker()
result = checker.check_statement(statement)
print(result)