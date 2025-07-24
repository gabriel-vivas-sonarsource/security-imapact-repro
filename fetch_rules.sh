#!/bin/bash

echo "Reading rules from rules.txt..."

# Create directory for HTML files
mkdir -p rule_html

# Count total rules first
total_rules=$(grep -c "RSPEC-" rules.txt)
echo "Found $total_rules rules to fetch:"

# Show which rules we'll fetch
echo "Rules to fetch:"
grep -o 'RSPEC-[0-9]*' rules.txt | sed 's/RSPEC-/- Rule /'

echo ""
echo "Starting download..."

# Read each URL and fetch it
counter=1
while IFS= read -r url; do
    if [[ -n "$url" && "$url" != \#* ]]; then
        # Extract rule number from URL
        rule_number=$(echo "$url" | grep -o 'RSPEC-[0-9]*' | sed 's/RSPEC-//')
        echo "[$counter/$total_rules] Fetching rule $rule_number from $url"
        
        # Curl the URL and save to file
        curl -s -L "$url" -o "rule_html/rule_${rule_number}.html"
        
        if [ $? -eq 0 ]; then
            echo "✓ Saved rule_${rule_number}.html"
        else
            echo "✗ Failed to fetch rule $rule_number"
        fi
        
        counter=$((counter + 1))
        
        # Small delay to be respectful
        sleep 1
    fi
done < rules.txt

echo ""
echo "Done! HTML files saved in rule_html/ directory"
echo "Fetched rules: $(ls rule_html/ | wc -l) files" 