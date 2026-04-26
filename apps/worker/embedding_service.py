from abc import ABC, abstractmethod
from typing import List
try:
    from sentence_transformers import SentenceTransformer
except ImportError:
    # Caso a biblioteca não esteja instalada no ambiente atual
    SentenceTransformer = None

class IEmbeddingProvider(ABC):
    """
    Interface para provedores de embeddings.
    Garante que qualquer provedor (Local, OpenAI, etc) retorne o mesmo formato.
    """
    @abstractmethod
    def generate_embedding(self, text: str) -> List[float]:
        pass

    @abstractmethod
    def get_dimensions(self) -> int:
        pass

class LocalHuggingFaceProvider(IEmbeddingProvider):
    """
    Provedor local usando sentence-transformers.
    Modelo: paraphrase-multilingual-MiniLM-L12-v2 (384 dimensões).
    """
    def __init__(self, model_name: str = 'paraphrase-multilingual-MiniLM-L12-v2'):
        if SentenceTransformer is None:
            raise ImportError("A biblioteca 'sentence-transformers' não está instalada. Execute: pip install sentence-transformers")
        
        self.model_name = model_name
        self.model = SentenceTransformer(model_name)
        self.dimensions = 384

    def generate_embedding(self, text: str) -> List[float]:
        if not text:
            return []
        embedding = self.model.encode(text)
        return embedding.tolist()

    def get_dimensions(self) -> int:
        return self.dimensions

class EmbeddingService:
    """
    Wrapper principal (Memory Engine).
    O resto do sistema interage apenas com esta classe.
    """
    def __init__(self, provider: IEmbeddingProvider = None):
        # Default para o provedor local definido na estratégia M2
        self.provider = provider or LocalHuggingFaceProvider()

    def get_embedding(self, text: str) -> List[float]:
        return self.provider.generate_embedding(text)

    def get_dimensions(self) -> int:
        return self.provider.get_dimensions()

# Exemplo de uso:
# service = EmbeddingService()
# vector = service.get_embedding("NOMMAD AI é o futuro.")
