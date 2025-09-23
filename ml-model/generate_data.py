import csv, random

with open("ml-data.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["temp", "hum", "mq", "label"])
    for _ in range(1000):
        t = random.uniform(10, 45)   # temperature
        h = random.uniform(10, 90)   # humidity
        mq = random.uniform(100, 800)  # air quality sensor value
        # simple rule-based labels
        if mq > 600 or t > 40:
            label = 2  # hazardous
        elif mq > 350 or t > 35:
            label = 1  # moderate
        else:
            label = 0  # normal
        w.writerow([t, h, mq, label])
