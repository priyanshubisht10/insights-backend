class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const queryObj = { ...this.queryStr };

    const excludeFields = ["page", "sort", "limit", "field"];

    excludeFields.forEach((i) => {
      delete queryObj[i];
    });

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      console.log(this.queryStr.sort);
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy); //passing the sort parameters to the sort method
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  paginate() {
    if (this.queryStr.page) {
      const page = this.queryStr.page * 1 || 1; //string => int
      const limit = this.queryStr.limit * 1 || 1; //string => int
      this.query.skip((page - 1) * limit).limit(limit); //convert into blocks by limit and then return each page seperately
    }
    return this;
  }
}

module.exports = APIFeatures;
