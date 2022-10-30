const API_URI = "http://localhost:5000/api/movies";

class API {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async getData(page) {
    const response = await fetch(this.endpoint + "?pages=" + page);

    const data = response.json();

    return data;
  }

  async sendData(payload) {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = response.json();
    return data;
  }

  async updateData(id, payload) {
    const response = await fetch(`${this.endpoint}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = response.json();
    return data;
  }

  async deleteData(id) {
    const response = await fetch(`${this.endpoint}/${id}`, {
      method: "DELETE",
    });

    const data = response.json();
    return data;
  }
}

export const api = new API(API_URI);
