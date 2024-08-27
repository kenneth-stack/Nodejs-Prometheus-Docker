#!/bin/bash
while true; do
  curl http://localhost:5000
  sleep 1  # Wait 1 second between requests
done
