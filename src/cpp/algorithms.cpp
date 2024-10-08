#include <emscripten/emscripten.h>
#include <string>
#include <vector>
#include <algorithm>

extern "C" {

EMSCRIPTEN_KEEPALIVE
const char* z_algorithm(const char* s) {
    std::string str(s);
    int n = str.length();
    std::vector<int> z(n);
    int l = 0, r = 0;
    for (int i = 1; i < n; i++) {
        if (i > r) {
            l = r = i;
            while (r < n && str[r - l] == str[r]) r++;
            z[i] = r - l;
            r--;
        } else {
            int k = i - l;
            if (z[k] < r - i + 1) {
                z[i] = z[k];
            } else {
                l = i;
                while (r < n && str[r - l] == str[r]) r++;
                z[i] = r - l;
                r--;
            }
        }
    }
    std::string result;
    for (int i = 0; i < n; i++) {
        result += std::to_string(z[i]) + " ";
    }
    char* output = (char*)malloc(result.length() + 1);
    strcpy(output, result.c_str());
    return output;
}

EMSCRIPTEN_KEEPALIVE
const char* manacher(const char* s) {
    std::string str(s);
    int n = str.length();
    std::vector<int> d1(n);
    for (int i = 0, l = 0, r = -1; i < n; i++) {
        int k = (i > r) ? 1 : std::min(d1[l + r - i], r - i + 1);
        while (0 <= i - k && i + k < n && str[i - k] == str[i + k]) {
            k++;
        }
        d1[i] = k--;
        if (i + k > r) {
            l = i - k;
            r = i + k;
        }
    }
    std::string result;
    for (int i = 0; i < n; i++) {
        result += std::to_string(d1[i] * 2 - 1) + " ";
    }
    char* output = (char*)malloc(result.length() + 1);
    strcpy(output, result.c_str());
    return output;
}

EMSCRIPTEN_KEEPALIVE
const char* kmp(const char* text, const char* pattern) {
    std::string t(text), p(pattern);
    int n = t.length(), m = p.length();
    std::vector<int> lps(m, 0);
    for (int i = 1, len = 0; i < m;) {
        if (p[i] == p[len]) {
            lps[i++] = ++len;
        } else if (len) {
            len = lps[len - 1];
        } else {
            lps[i++] = 0;
        }
    }
    std::vector<int> matches;
    for (int i = 0, j = 0; i < n;) {
        if (p[j] == t[i]) {
            i++, j++;
        }
        if (j == m) {
            matches.push_back(i - j);
            j = lps[j - 1];
        } else if (i < n && p[j] != t[i]) {
            if (j) j = lps[j - 1];
            else i++;
        }
    }
    std::string result;
    for (int match : matches) {
        result += std::to_string(match) + " ";
    }
    char* output = (char*)malloc(result.length() + 1);
    strcpy(output, result.c_str());
    return output;
}

EMSCRIPTEN_KEEPALIVE
const char* lcs(const char* s1, const char* s2) {
    std::string str1(s1), str2(s2);
    int m = str1.length(), n = str2.length();
    std::vector<std::vector<int>> dp(m + 1, std::vector<int>(n + 1, 0));
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (str1[i - 1] == str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = std::max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    std::string lcs;
    int i = m, j = n;
    while (i > 0 && j > 0) {
        if (str1[i - 1] == str2[j - 1]) {
            lcs = str1[i - 1] + lcs;
            i--, j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }
    char* output = (char*)malloc(lcs.length() + 1);
    strcpy(output, lcs.c_str());
    return output;
}

}