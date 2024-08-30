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
# url = "http://35.172.9.82:8086/"
# token = "rG6eQ9r9VCmSezYPnXTxJXlzVmOiFVjJdTzFI0CfChv0pQHV8AGfx5wbaMmxJpGkJStU3XXwfQUFhOKrVRw7pg=="
# org = "Testruns"
# bucket = "Testruns"
# client = InfluxDBClient(url=url, token=token, org=org)
# database = "Testruns"

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
        # timestamp = int(time.time() * 1000000000)  # Convert to nanoseconds
        start_time = time.time()
        timestamp = int(start_time * 1000000000)

        # Calculate wave values
        sine_value = amplitude * np.sin(2 * np.pi * frequency * timestamp / 1000000000)  # Sine wave
        sawtooth_value = (2 * amplitude / np.pi) * np.arctan(np.tan(np.pi * frequency * timestamp / 1000000000))  # Sawtooth wave
        square_value = amplitude * np.sign(np.sin(2 * np.pi * frequency * timestamp / 1000000000))  # Square wave
        triangle_value = (2 * amplitude / np.pi) * np.arcsin(np.sin(2 * np.pi * frequency * timestamp / 1000000000))  # Triangle wave

        # Create a single point with all wave values as fields
        point = Point("Simulate_connect").tag("location", "WavePoints").field("sine_wave", sine_value).field("sawtooth_wave", sawtooth_value).field("square_wave", square_value).field("triangle_wave", triangle_value).time(timestamp)
        
        # Write the point to InfluxDB
        write_api.write(bucket=bucket, record=point)

        # Log the data with ISO 8601 formatted timestamp
        current_time = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'  # Format to ISO 8601
        log_message = (f"Timestamp: {current_time}, Sine: {sine_value}, Sawtooth: {sawtooth_value}, "
                       f"Square: {square_value}, Triangle: {triangle_value}")
        logging.info(log_message)
        print(log_message)

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
