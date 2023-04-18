import replicate
import os


class ModelUtils:
    @staticmethod
    def generate_video(file, drivingfilename):
        if "REPLICATE_API_TOKEN" not in os.environ:
            os.environ["REPLICATE_API_TOKEN"] = "540dbd776678c4756efba5d0f3466ad5102ab2b9"
        driving_filename = drivingfilename
        print("working...")
        try:
            output = replicate.run(
                "yoyo-nb/thin-plate-spline-motion-model:382ceb8a9439737020bad407dec813e150388873760ad4a5a83a2ad01b039977",
                input={"source_image": file,
                       "driving_video": open(driving_filename, "rb")}
            )
        except Exception as e:
            print(e)
            output = ""
        return output

