import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import cameraCheckIn from "../image/camera-checkin.svg";
const CheckInPage = () => {
  const videoElement = useRef<HTMLVideoElement | null>(null);
  const [qrScanner, setQrScanner] = useState<QrScanner | null>(null);
  const [scanning, setScanning] = useState(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [cameraIsAvailable, setCameraIsAvailable] = useState(false);
  const showDialogSuccess = useRef<HTMLDialogElement>(null);
  const startScanning = async () => {
    if (videoElement.current) {
      if (!qrScanner) {
        const scanner = new QrScanner(
          videoElement.current,
          (result) => {
            if (scanning) {
              scanner.stop();
              console.log("QR code detected:", result);
              onDetect(result);
            }
          },
          {
            highlightScanRegion: true,
          }
        );
        setQrScanner(scanner);
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (stream) {
          setCameraIsAvailable(true);
          stream.getTracks().forEach((track) => track.stop()); // Stop the stream after checking
        }
      } catch (error) {
        console.error("Cannot access camera:", error);
      }

      try {
        const cameraPermission = await navigator.permissions.query({
          name: "camera" as PermissionName,
        });
        if (cameraPermission.state === "granted") {
          console.log("Camera access granted");
          setCameraPermissionGranted(true);
        } else if (cameraPermission.state === "prompt") {
          console.log("User has not decided on camera access yet");
        } else {
          console.log("Camera access denied");
        }
      } catch (permissionError) {
        console.error("Cannot check camera permission:", permissionError);
      }

      if (cameraIsAvailable && cameraPermissionGranted) {
        await qrScanner?.start();
        setScanning(true);
      }
    }
  };

  const stopScanning = async () => {
    if (qrScanner) {
      qrScanner.stop();
      setScanning(false);
    }
  };

  const onDetect = async (content: any) => {
    // to do call api checkIn here
    console.log("🚀 ~ QR Code detected: ", content);
  };

  useEffect(() => {
    return () => {
      if (qrScanner) {
        qrScanner.stop();
      }
    };
  }, [qrScanner]);

  return (
    <div>
      <div className="rounded-lg py-4 py-md-8 text-center text-md-left border border-solid border-gray-300 px-md-8">
        <h4 className="text-gray-700 font-bold text-xl">Thực hiện check in</h4>

        {/* Show video element when scanning */}
        {scanning && (
          <div>
            <video ref={videoElement} />
          </div>
        )}

        {/* Button to start scanning */}
        {!scanning && (
          <div
            className="w-[120px] h-[40px] flex justify-center items-center gap-x-1.5 mt-4 mt-md-[23px] mx-auto mx-md-0 text-center text-sm rounded-lg bg-[#FE771B] text-white font-semibold cursor-pointer"
            onClick={startScanning}
          >
            Checkin
            <img src={cameraCheckIn} alt="camera" />
          </div>
        )}

        {/* Button to stop scanning */}
        {scanning && (
          <div
            className="w-[120px] h-[40px] flex justify-center items-center gap-x-1.5 mt-4 mx-auto mx-lg-0 text-center text-sm rounded-lg bg-[#FE771B] text-white font-semibold cursor-pointer"
            onClick={stopScanning}
          >
            Quay lại
          </div>
        )}
      </div>
      <dialog id="my_modal_1" className="modal" ref={showDialogSuccess}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default CheckInPage;
