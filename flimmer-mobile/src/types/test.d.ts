declare global {
  namespace NodeJS {
    interface Global {
      mockUser: {
        parent: {
          id: string;
          name: string;
          role: 'parent';
          childIds: string[];
        };
        child: {
          id: string;
          name: string;
          role: 'child';
          parentId: string;
        };
      };
    }
  }

  var mockUser: {
    parent: {
      id: string;
      name: string;
      role: 'parent';
      childIds: string[];
    };
    child: {
      id: string;
      name: string;
      role: 'child';
      parentId: string;
    };
  };
}

export {}; 