import re
from typing import List, Dict, Any

class DocumentChunker:
    """
    Splits technical documents into semantic chunks with metadata preservation.
    """
    @staticmethod
    def chunk_text(text: str, chunk_size: int = 500, overlap: int = 100) -> List[Dict[str, Any]]:
        # Split by page marks or sections if present
        pages = re.split(r'--- \[PAGE (\d+)\] ---', text)
        chunks = []
        chunk_idx = 0
        
        if len(pages) > 1:
            for i in range(1, len(pages), 2):
                page_num = int(pages[i])
                page_content = pages[i+1].strip()
                words = page_content.split()
                
                for j in range(0, len(words), chunk_size - overlap):
                    chunk_str = " ".join(words[j:j + chunk_size])
                    if chunk_str.strip():
                        chunks.append({
                            "chunk_index": chunk_idx,
                            "page_number": page_num,
                            "content": chunk_str
                        })
                        chunk_idx += 1
        else:
            words = text.split()
            for j in range(0, len(words), chunk_size - overlap):
                chunk_str = " ".join(words[j:j + chunk_size])
                if chunk_str.strip():
                    chunks.append({
                        "chunk_index": chunk_idx,
                        "page_number": 1,
                        "content": chunk_str
                    })
                    chunk_idx += 1
                    
        return chunks

document_chunker = DocumentChunker()
