import replicate
import os


class ModelUtils:
    @staticmethod
    def generate_video(filename, drivingfilename):
        if "REPLICATE_API_TOKEN" not in os.environ:
            os.environ["REPLICATE_API_TOKEN"] = "c7b6b292173460c80a9db1a45b7ec74c11051406"
        uploaded_filename = filename
        driving_filename = drivingfilename
        print("working...")
        try:
            output = replicate.run(
                "yoyo-nb/thin-plate-spline-motion-model:382ceb8a9439737020bad407dec813e150388873760ad4a5a83a2ad01b039977",
                input={"source_image": open(uploaded_filename, "rb"),
                       "driving_video": open(driving_filename, "rb")}
            )
        except Exception as e:
            print(e)
            output = ""
        return output

