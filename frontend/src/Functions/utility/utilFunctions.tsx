export async function resizeAndCompress(fileURL: string) : Promise<Blob> {
    return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                let width = img.width;
                let height = img.height;
                const maxWidth = 800;
                const maxHeight = 800;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx!.drawImage(img, 0, 0, width, height);

                canvas.toBlob(function(blob) {
                    blob && resolve(blob);
                }, 'image/jpeg', 0.7);
            };

            img.onerror = function() {
                reject(new Error("Unable to load the image."));
            };

            img.src = fileURL;
        });
    }