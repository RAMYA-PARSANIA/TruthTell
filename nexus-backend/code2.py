import requests
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# # Initialize NLP models
# nlp = spacy.load("en_core_web_lg")
# sentence_model = SentenceTransformer('all-MiniLM-L6-v2')

# class FactChecker:
#     def __init__(self):
#         self.google_api_key = os.getenv("GOOGLE_API_KEY")
#         self.wikidata_url = "https://www.wikidata.org/w/api.php"
#         self.datacommons_url = "https://api.datacommons.org/v1"
#         self.politifact_url = "https://api.politifact.com/v1"
#         self.knowledge_graph = nx.Graph()

#     def break_complex_claim(self, claim: str) -> List[str]:
#         """Break complex claims into simpler statements using SpaCy"""
#         doc = nlp(claim)
#         simple_claims = []
        
#         for sent in doc.sents:
#             # Extract subject-verb-object patterns
#             for chunk in sent.noun_chunks:
#                 if chunk.root.dep_ in ["nsubj", "dobj"]:
#                     simple_claim = f"{chunk.root.head.text} {chunk.text}"
#                     simple_claims.append(simple_claim)
        
#         return simple_claims

#     def semantic_search(self, claim: str, reference_claims: List[str]) -> List[Dict]:
#         """Implement semantic search using sentence embeddings"""
#         claim_embedding = sentence_model.encode(claim)
#         reference_embeddings = sentence_model.encode(reference_claims)
        
#         # Calculate cosine similarity
#         similarities = np.inner(claim_embedding, reference_embeddings)
        
#         results = []
#         for idx, score in enumerate(similarities):
#             if score > 0.7:  # Similarity threshold
#                 results.append({
#                     "reference_claim": reference_claims[idx],
#                     "similarity_score": float(score)
#                 })
        
#         return results

#     def fuzzy_match_claims(self, claim: str, reference_claims: List[str]) -> List[Dict]:
#         """Implement fuzzy matching for claims"""
#         matches = []
#         for ref_claim in reference_claims:
#             ratio = fuzz.token_sort_ratio(claim, ref_claim)
#             if ratio > 80:  # Threshold for fuzzy matching
#                 matches.append({
#                     "reference_claim": ref_claim,
#                     "match_ratio": ratio
#                 })
#         return matches

#     def extract_entities(self, claim: str) -> Dict:
#         """Extract named entities and topics from claim"""
#         doc = nlp(claim)
#         entities = {
#             "persons": [],
#             "organizations": [],
#             "locations": [],
#             "dates": [],
#             "topics": []
#         }
        
#         for ent in doc.ents:
#             if ent.label_ == "PERSON":
#                 entities["persons"].append(ent.text)
#             elif ent.label_ == "ORG":
#                 entities["organizations"].append(ent.text)
#             elif ent.label_ == "GPE":
#                 entities["locations"].append(ent.text)
#             elif ent.label_ == "DATE":
#                 entities["dates"].append(ent.text)
        
#         return entities

#     def query_wikidata(self, entity: str) -> Dict:
#         """Query Wikidata API for entity information"""
#         params = {
#             "action": "wbsearchentities",
#             "format": "json",
#             "language": "en",
#             "search": entity
#         }
        
#         response = requests.get(self.wikidata_url, params=params)
#         return response.json()

#     def query_datacommons(self, entity: str) -> Dict:
#         """Query Data Commons API for statistical data"""
#         headers = {"X-API-Key": os.getenv("DATACOMMONS_API_KEY")}
#         endpoint = f"{self.datacommons_url}/entity/{entity}"
        
#         response = requests.get(endpoint, headers=headers)
#         return response.json()

#     def query_politifact(self, claim: str) -> Dict:
#         """Query PolitiFact API for fact checks"""
#         headers = {"Authorization": f"Bearer {os.getenv('POLITIFACT_API_KEY')}"}
#         params = {"statement": claim}
        
#         response = requests.get(f"{self.politifact_url}/factchecks", 
#                               headers=headers, 
#                               params=params)
#         return response.json()

#     def build_knowledge_graph(self, entities: Dict):
#         """Build knowledge graph from extracted entities"""
#         for person in entities["persons"]:
#             self.knowledge_graph.add_node(person, type="person")
            
#         for org in entities["organizations"]:
#             self.knowledge_graph.add_node(org, type="organization")
            
#         # Add edges between related entities
#         for person in entities["persons"]:
#             for org in entities["organizations"]:
#                 if self.are_entities_related(person, org):
#                     self.knowledge_graph.add_edge(person, org)

#     def fact_check(self, claim: str) -> Dict:
#         """Main fact-checking method combining all approaches"""
#         results = {
#             "simple_claims": [],
#             "entities": {},
#             "semantic_matches": [],
#             "fuzzy_matches": [],
#             "fact_checks": {},
#             "knowledge_graph": {}
#         }
        
#         # Break down complex claim
#         results["simple_claims"] = self.break_complex_claim(claim)
        
#         # Extract entities
#         results["entities"] = self.extract_entities(claim)
        
#         # Build knowledge graph
#         self.build_knowledge_graph(results["entities"])
        
#         # Query various fact-checking sources
#         for entity in results["entities"]["persons"] + results["entities"]["organizations"]:
#             results["fact_checks"][entity] = {
#                 "wikidata": self.query_wikidata(entity),
#                 "datacommons": self.query_datacommons(entity),
#                 "politifact": self.query_politifact(claim)
#             }
        
#         return results

#     def are_entities_related(self, entity1: str, entity2: str) -> bool:
#         """Helper method to check if entities are related"""
#         # Implement logic to determine entity relationships
#         # This could involve checking co-occurrences in text or external knowledge bases
#         return True

class FactChecker:
    def __init__(self):
        self.fact_url = os.getenv("FACT_CHECK_URL")
        self.api_key = os.getenv("GOOGLE_API_KEY")

    def check_fact(self, claim: str):
        params = {
            "key": self.api_key,
            "query": claim
        }

        response = requests.get(self.fact_url, params=params)
        return response.json()

def main():
    checker = FactChecker()
    claim = "Tesla CEO Elon Musk acquired Twitter for $44 billion in 2022"
    results = checker.check_fact(claim)
    print(results)

if __name__ == "__main__":
    main()
