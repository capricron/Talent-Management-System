const natural = require('natural');
const TfIdf = natural.TfIdf;
const compromise = require('compromise');
const { dot, norm } = require('mathjs');

class JobCandidateMatch {
    tfidf: any;
    constructor() {
        this.tfidf = new TfIdf();
    }

    preprocessText(text) {
        // Convert to lowercase
        text = text.toLowerCase();

        // Remove special characters and numbers
        text = text.replace(/[^a-zA-Z\s]/g, '');

        // Tokenize and lemmatize using compromise
        const doc = compromise(text);
        const lemmatized = doc.terms().out('text');

        return lemmatized;
    }

    extractSkills(text) {
        const doc = compromise(text);

        // Extract noun chunks and named entities as skills
        const skills = new Set();

        doc.nouns().json().forEach(chunk => skills.add(chunk.text.toLowerCase()));
        doc.topics().json().forEach(ent => skills.add(ent.text.toLowerCase()));

        return Array.from(skills);
    }

    padVectors(vectorA, vectorB) {
        const maxLength = Math.max(vectorA.length, vectorB.length);
        const paddedVectorA = Array(maxLength).fill(0);
        const paddedVectorB = Array(maxLength).fill(0);

        for (let i = 0; i < vectorA.length; i++) {
            paddedVectorA[i] = vectorA[i];
        }

        for (let i = 0; i < vectorB.length; i++) {
            paddedVectorB[i] = vectorB[i];
        }

        return [paddedVectorA, paddedVectorB];
    }

    calculateCosineSimilarity(vectorA, vectorB) {
        return dot(vectorA, vectorB) / (norm(vectorA) * norm(vectorB));
    }

    calculateSimilarity(jobText, cvText) {
        const processedJob = this.preprocessText(jobText);
        const processedCV = this.preprocessText(cvText);

        const jobSkills = this.extractSkills(jobText);
        const cvSkills = this.extractSkills(cvText);

        // Add texts to tf-idf
        this.tfidf.addDocument(processedJob);
        this.tfidf.addDocument(processedCV);

        // Generate TF-IDF vectors
        const jobVector = [];
        const cvVector = [];

        this.tfidf.listTerms(0).forEach(item => jobVector.push(item.tfidf));
        this.tfidf.listTerms(1).forEach(item => cvVector.push(item.tfidf));

        // Pad vectors to the same length
        const [paddedJobVector, paddedCvVector] = this.padVectors(jobVector, cvVector);

        const cosineSimilarity = this.calculateCosineSimilarity(paddedJobVector, paddedCvVector);

        const matchedSkills = jobSkills.filter(skill => cvSkills.includes(skill));
        const skillMatchPercentage = (matchedSkills.length / jobSkills.length) * 100;

        return {
            overall_similarity: Math.round(cosineSimilarity * 100),
            skill_match_percentage: Math.round(skillMatchPercentage),
            matched_skills: matchedSkills,
            missing_skills: jobSkills.filter(skill => !cvSkills.includes(skill)),
        };
    }

    analyzeExperienceRelevance(jobRequirements, candidateExperience) {
        const processedReq = this.preprocessText(jobRequirements);
        const processedExp = this.preprocessText(candidateExperience);

        this.tfidf.addDocument(processedReq);
        this.tfidf.addDocument(processedExp);

        const reqVector = [];
        const expVector = [];

        this.tfidf.listTerms(0).forEach(item => reqVector.push(item.tfidf));
        this.tfidf.listTerms(1).forEach(item => expVector.push(item.tfidf));

        // Pad vectors to the same length
        const [paddedReqVector, paddedExpVector] = this.padVectors(reqVector, expVector);

        const relevanceScore = this.calculateCosineSimilarity(paddedReqVector, paddedExpVector);

        return {
            experience_relevance: Math.round(relevanceScore * 100),
        };
    }
}

// Example usage
function jobMatch(jobDesc, cvText) {
    const matcher = new JobCandidateMatch();

    const similarityResults = matcher.calculateSimilarity(jobDesc, cvText);
    const experienceResults = matcher.analyzeExperienceRelevance(jobDesc, cvText);

    const finalResults = { ...similarityResults, ...experienceResults };

    return finalResults['overall_similarity'];
    // console.log("\nJob-Candidate Matching Results:");
    // console.log("========================================");
    // console.log(`Overall Match: ${finalResults['overall_similarity']}%`);
    // console.log(`Skill Match: ${finalResults['skill_match_percentage']}%`);
    // console.log(`Experience Relevance: ${finalResults['experience_relevance']}%`);
    // console.log("\nMatched Skills:");
    // finalResults.matched_skills.forEach(skill => console.log(`✓ ${skill}`));
    // console.log("\nMissing Skills:");
    // finalResults.missing_skills.forEach(skill => console.log(`× ${skill}`));
}

export default jobMatch;
