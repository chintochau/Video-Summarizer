const apiUrl = `${import.meta.env.VITE_API_BASE_URL}`;

class QuotaService {
    static KEY = 'quota';
  
    static getQuota() {
      const quota = localStorage.getItem(this.KEY);
      return quota ? JSON.parse(quota) : 5; // Default to 5 free quotas
    }
  
    static setQuota(quota) {
      localStorage.setItem(this.KEY, JSON.stringify(quota));
    }
  
    static decrementQuota() {
      let quota = this.getQuota();
      if (quota > 0) {
        quota--;
        this.setQuota(quota);
      }
    }

    static incrementQuota() {
      let quota = this.getQuota();
      quota++;
      this.setQuota(quota);
    }
  
    static resetQuota() {
      this.setQuota(5); // Reset to 5 free quotas
    }

    static checkQuota() {
      const quota = this.getQuota();
      if (quota > 0) {
        return true;
      }
      throw new Error("Insufficient quota");
    }

  }
  
  export default QuotaService;