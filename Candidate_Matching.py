from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import spacy
import re
import pandas as pd
from typing import Dict, List, Tuple
''' install step
python -m venv venv
On Windows use: venv\Scripts\activate
pip install spacy scikit-learn pandas numpy
python -m spacy download en_core_web_sm
pip install spacy scikit-learn pandas numpy
'''
class JobCandidateMatch:
    def __init__(self):
        # Load English language model from spacy
        self.nlp = spacy.load('en_core_web_sm')
        self.tfidf = TfidfVectorizer(stop_words='english')
        
    def preprocess_text(self, text: str) -> str:
        """
        Preprocess text by removing special characters, converting to lowercase,
        and removing extra whitespace
        """
        # Convert to lowercase
        text = text.lower()
        
        # Remove special characters and numbers
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        # Lemmatize text using spacy
        doc = self.nlp(text)
        lemmatized = ' '.join([token.lemma_ for token in doc])
        
        return lemmatized
    
    def extract_skills(self, text: str) -> List[str]:
        """
        Extract skills from text using spacy's entity recognition and noun chunks
        """
        doc = self.nlp(text)
        
        # Extract noun chunks as potential skills
        skills = set([chunk.text.lower() for chunk in doc.noun_chunks])
        
        # Add named entities
        skills.update([ent.text.lower() for ent in doc.ents])
        
        return list(skills)
    
    def calculate_similarity(self, job_text: str, cv_text: str) -> Dict:
        """
        Calculate similarity scores between job description and CV
        """
        # Preprocess texts
        processed_job = self.preprocess_text(job_text)
        processed_cv = self.preprocess_text(cv_text)
        
        # Extract skills
        job_skills = self.extract_skills(job_text)
        cv_skills = self.extract_skills(cv_text)
        
        # Calculate TF-IDF vectors
        tfidf_matrix = self.tfidf.fit_transform([processed_job, processed_cv])
        
        # Calculate cosine similarity
        similarity_score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        
        # Calculate skill match percentage
        matched_skills = set(job_skills).intersection(set(cv_skills))
        skill_match_percentage = len(matched_skills) / len(job_skills) if job_skills else 0
        
        return {
            'overall_similarity': round(similarity_score * 100, 2),
            'skill_match_percentage': round(skill_match_percentage * 100, 2),
            'matched_skills': list(matched_skills),
            'missing_skills': list(set(job_skills) - set(cv_skills))
        }
    
    def analyze_experience_relevance(self, job_requirements: str, candidate_experience: str) -> Dict:
        """
        Analyze the relevance of candidate's experience to job requirements
        """
        # Preprocess texts
        processed_req = self.preprocess_text(job_requirements)
        processed_exp = self.preprocess_text(candidate_experience)
        
        # Calculate TF-IDF vectors
        tfidf_matrix = self.tfidf.fit_transform([processed_req, processed_exp])
        
        # Calculate relevance score
        relevance_score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        
        return {
            'experience_relevance': round(relevance_score * 100, 2)
        }

def main():
    # Example usage
    matcher = JobCandidateMatch()
    
    # Example job description
    job_desc = """
    Senior Software Engineer
    Requirements:
    - 5+ years experience in Python development
    - Experience with machine learning and AI
    - Strong knowledge of SQL and database design
    - Experience with cloud platforms (AWS, GCP)
    - Excellent problem-solving skills
    """
    
    # Example CV
    cv_text = """
    Experienced Software Engineer with 6 years of Python development.
    Skills: Machine learning, TensorFlow, SQL, PostgreSQL, AWS
    Led development of AI-powered recommendation system
    Implemented cloud-based solutions using AWS services
    """
    
    # Calculate matches
    similarity_results = matcher.calculate_similarity(job_desc, cv_text)
    experience_results = matcher.analyze_experience_relevance(job_desc, cv_text)
    
    # Combine results
    final_results = {**similarity_results, **experience_results}
    
    # Create a formatted output
    print("\nJob-Candidate Matching Results:")
    print("=" * 40)
    print(f"Overall Match: {final_results['overall_similarity']}%")
    print(f"Skill Match: {final_results['skill_match_percentage']}%")
    print(f"Experience Relevance: {final_results['experience_relevance']}%")
    print("\nMatched Skills:")
    for skill in final_results['matched_skills']:
        print(f"✓ {skill}")
    print("\nMissing Skills:")
    for skill in final_results['missing_skills']:
        print(f"× {skill}")

if __name__ == "__main__":
    main()