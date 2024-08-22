import numpy as np
import time
import logging
from datetime import datetime
from influxdb_client import InfluxDBClient, Point
from influxdb_client.client.write_api import SYNCHRONOUS

# Set up logging
logging.basicConfig(filename='influxdb_data_log.txt', level=logging.INFO, 
                    format='%(message)s')

# Set up InfluxDB connection
url = "https://us-east-1-1.aws.cloud2.influxdata.com/"
token = "5uChyvv8PHHOp_BF5Uhu0-z8IfE3ckVoCfJp5NHiP54T4AXbtyjDcWl8zW9deVRhW6Td6W0xYc95bXDWGq3Peg=="
org = "Learny"
bucket = "Wave"
client = InfluxDBClient(url=url, token=token, org=org)
# Create write API
write_api = client.write_api(write_options=SYNCHRONOUS)

# Parameters for the waves
frequency = 0.1   # Frequency of the waves
amplitude = 10    # Amplitude of the waves

try:
    while True:  # Run indefinitely
        start_time = time.time()
        timestamp = int(start_time * 1000000000)

        # Calculate original wave values for Simulate_connect
        sine_value = amplitude * np.sin(2 * np.pi * frequency * timestamp / 1000000000)  # Sine wave
        sawtooth_value = (2 * amplitude / np.pi) * np.arctan(np.tan(np.pi * frequency * timestamp / 1000000000))  # Sawtooth wave
        square_value = amplitude * np.sign(np.sin(2 * np.pi * frequency * timestamp / 1000000000))  # Square wave
        triangle_value = (2 * amplitude / np.pi) * np.arcsin(np.sin(2 * np.pi * frequency * timestamp / 1000000000))  # Triangle wave

        # Create a single point with all original wave values as fields for Simulate_connect
        point_simulate = Point("Simulate_connect").tag("location", "WavePoints") \
            .field("sine_wave", sine_value).field("sawtooth_wave", sawtooth_value) \
            .field("square_wave", square_value).field("triangle_wave", triangle_value) \
            .time(timestamp)

        # Calculate new wave values for Demo_connect
        cosine_value = amplitude * np.cos(2 * np.pi * frequency * timestamp / 1000000000)  # Cosine wave
        rectified_sine_value = amplitude * np.abs(np.sin(2 * np.pi * frequency * timestamp / 1000000000))  # Rectified Sine wave
        exp_decay_value = amplitude * np.exp(-frequency * (timestamp / 1000000000))  # Exponential Decay
        gaussian_value = amplitude * np.exp(-0.5 * ((timestamp / 1000000000 - 5) ** 2) / (2 ** 2))  # Gaussian

        # Create a single point with all new wave values as fields for Demo_connect
        point_demo = Point("Demo_connect").tag("location", "DemoPoints") \
            .field("cosine_wave", cosine_value).field("rectified_sine_wave", rectified_sine_value) \
            .field("exp_decay_wave", exp_decay_value).field("gaussian_wave", gaussian_value) \
            .time(timestamp)

        # Write both points to InfluxDB
        write_api.write(bucket=bucket, record=[point_simulate, point_demo])

        # Log the data with ISO 8601 formatted timestamp for Simulate_connect
        current_time = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'  # Format to ISO 8601
        log_message_simulate = (f"Simulate_connect - Timestamp: {current_time}, Sine: {sine_value}, "
                                f"Sawtooth: {sawtooth_value}, Square: {square_value}, Triangle: {triangle_value}")
        logging.info(log_message_simulate)
        print(log_message_simulate)

        # Log the data with ISO 8601 formatted timestamp for Demo_connect
        log_message_demo = (f"Demo_connect - Timestamp: {current_time}, Cosine: {cosine_value}, "
                            f"Rectified Sine: {rectified_sine_value}, Exp Decay: {exp_decay_value}, "
                            f"Gaussian: {gaussian_value}")
        logging.info(log_message_demo)
        print(log_message_demo)

        end_time = time.time()
        sleep_time = 1 - (end_time - start_time)
        if sleep_time > 0:
            time.sleep(sleep_time)

except KeyboardInterrupt:
    print("Process interrupted. Exiting.")
    logging.info("Process interrupted by user.")
except Exception as e:
    print("An error occurred:", e)
    logging.error(f"An error occurred: {e}")
finally:
    print("Complete. Return to the InfluxDB UI.")
    logging.info("Process completed.")
