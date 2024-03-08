import subprocess

def read_temp():

  # Read the temperature calling the bash script named temperature
  tempread = subprocess.check_output(["temperature"])

  # Get rid of the trailing \n
  tempStripped = tempread.rstrip()

  # Convert to float
  tempFloat = float(tempStripped)

  return tempFloat
