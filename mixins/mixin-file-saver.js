import { saveAs } from '@modules/file-saver';

export default {
  methods: {
    onSaveAs(file, config = {}, filename = null) {
      return new Promise((resolve, reject) => {
        try {
          const blob = new Blob([file], config);
          saveAs(blob, filename);

          resolve();
        } catch (error) {
          reject(new Error(error));
        }
      });
    },
  },
};
