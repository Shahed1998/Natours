class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    // 1a) Filtering request...
    // making a shallow copy of the request object
    // making a list of queries to be filtered
    // deleting from the request object
    const reqObj = { ...this.queryStr };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete reqObj[el]);
    // 1b) Advance filtering
    // remove gte,lte, gt,lt from request query using regular expression
    // /\b(gte|lte|gt|lt)\b/g => detect all elements matching exactly as mentioned
    let queryStr = JSON.stringify(reqObj);
    queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`);
    this.query.find(JSON.parse(queryStr));
    // first we need to build the query then we need to execute the query
    return this;
  }

  // 2) Sorting
  // to sort by descending order we use -ve sign before the parameter
  // if both fields are of same value
  // we need to sort them by second criteria
  // in mongoose => sort('first_criteria second_criteria')
  // to have multiple sort parameters in the query use comma
  sort() {
    if (this.queryStr.sort) {
      const sortByCriteria = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortByCriteria); // chaining to query
    }
    return this;
  }

  // 3) Field limiting
  limit() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // excluding the __v field from response
    }
    return this;
  }

  // 4) Pagination
  // By default we will select page 1
  // req.query.page multiplied by 1 to convert it into number
  // the user might request data from pages that don't exist
  // throw error
  paginate() {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
