// names
// {'ID': 'id', 'culture': 'xxx', name: []}

export default interface Name {
  ID: string;
  culture: number;
  content: string [];
}
// citations
// {'ID': 'id', 'author': [], 'title': 'yyy', 'date': new Date('2014-03-01T08:00:00Z'), 'version':'xxx', publisher:'', Location:'' }

export default interface Citation {
  ID: string;
  author: string;
  title: string;
}

