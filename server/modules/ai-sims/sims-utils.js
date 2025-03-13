// Get schema structure
export const  getSchemaStructure =  (model)  => {
    const schemaPaths = model.schema.paths;
    const structure = {};
  
    Object.keys(schemaPaths).forEach((path) => {
      structure[path] = schemaPaths[path].instance;
    });
  
    return structure;
  }