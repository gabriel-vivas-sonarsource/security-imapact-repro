#!/usr/bin/env node

const fs = require('fs');
const https = require('https');
const { URL } = require('url');

// Read the rules.txt file
const rulesContent = fs.readFileSync('rules.txt', 'utf8');
const urls = rulesContent.trim().split('\n').filter(line => line.trim());

console.log(`Found ${urls.length} rules to fetch`);

async function fetchRule(url) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        
        const options = {
            hostname: urlObj.hostname,
            port: 443,
            path: urlObj.pathname,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                resolve(data);
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.end();
    });
}

function extractRuleInfo(html, url) {
    // Extract rule key from URL
    const ruleKey = url.match(/RSPEC-(\d+)/)?.[1] || 'unknown';
    
    // Extract title
    const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/s);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : 'Unknown Title';
    
    // Extract description - look for the rule description section
    const descMatch = html.match(/<div[^>]*class="[^"]*rule-desc[^"]*"[^>]*>(.*?)<\/div>/s);
    let description = 'No description found';
    if (descMatch) {
        description = descMatch[1].replace(/<[^>]*>/g, '').trim().substring(0, 200) + '...';
    }
    
    // Extract code examples - look for code blocks
    const codeBlocks = [];
    const codeMatches = html.matchAll(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gs);
    for (const match of codeMatches) {
        const code = match[1]
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .trim();
        if (code && code.length > 10) {
            codeBlocks.push(code);
        }
    }
    
    return {
        ruleKey,
        title,
        description,
        codeBlocks,
        url
    };
}

async function main() {
    const results = [];
    
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        console.log(`Fetching rule ${i + 1}/${urls.length}: ${url}`);
        
        try {
            const html = await fetchRule(url);
            const ruleInfo = extractRuleInfo(html, url);
            results.push(ruleInfo);
            console.log(`✓ Extracted: ${ruleInfo.title} (${ruleInfo.codeBlocks.length} code examples)`);
        } catch (error) {
            console.error(`✗ Failed to fetch ${url}:`, error.message);
        }
        
        // Small delay to be respectful
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Save results to JSON file
    fs.writeFileSync('rules_data.json', JSON.stringify(results, null, 2));
    console.log(`\nSaved rule information to rules_data.json`);
    
    // Print summary
    console.log('\nSummary:');
    results.forEach((rule, index) => {
        console.log(`${index + 1}. RSPEC-${rule.ruleKey}: ${rule.title}`);
        console.log(`   Examples: ${rule.codeBlocks.length}`);
    });
}

main().catch(console.error); 