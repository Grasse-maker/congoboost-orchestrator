import json
import time
import requests
import ssl
import socket
from urllib.parse import urlparse
from datetime import datetime

class AgentAuditor:
    """
    Agent Auditor - Agentcy Enterprise (NEXUS INTELLIGENCE ENGINE)
    Analyse profonde basée sur des requêtes aux serveurs mondiaux (Google PageSpeed, SSL, Scraping DOM).
    """

    def __init__(self):
        self.output_file = "audit_reports.json"
        
        # Pour une version "Enterprise", vous pourriez injecter vos clés API ici
        self.google_api_key = None 

    def _analyze_pagespeed(self, url):
        """Node 1: Connecte à l'API Google PageSpeed Insights pour des métriques réelles."""
        print(f"[{datetime.now().strftime('%H:%M:%S')}] ⚡ Interrogation de Google PageSpeed Insights...")
        api_url = f"https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url={url}"
        if self.google_api_key:
            api_url += f"&key={self.google_api_key}"
            
        try:
            response = requests.get(api_url, timeout=30)
            if response.status_code == 200:
                data = response.json()
                lighthouse = data.get("lighthouseResult", {})
                categories = lighthouse.get("categories", {})
                
                return {
                    "performance_score": categories.get("performance", {}).get("score", 0) * 100 if categories.get("performance") else 0,
                    "seo_score": categories.get("seo", {}).get("score", 0) * 100 if categories.get("seo") else 0,
                    "accessibility_score": categories.get("accessibility", {}).get("score", 0) * 100 if categories.get("accessibility") else 0,
                    "status": "SUCCESS"
                }
            return {"status": "FAILED", "reason": f"HTTP {response.status_code}"}
        except Exception as e:
            return {"status": "ERROR", "reason": str(e)}

    def _analyze_security_ssl(self, url):
        """Node 2: Connecte aux serveurs pour vérifier le certificat SSL."""
        print(f"[{datetime.now().strftime('%H:%M:%S')}] 🔒 Vérification des protocoles de sécurité (SSL/TLS)...")
        parsed_url = urlparse(url)
        hostname = parsed_url.hostname or url
        if not hostname: return {"status": "INVALID_URL"}

        context = ssl.create_default_context()
        try:
            with socket.create_connection((hostname, 443), timeout=10) as sock:
                with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                    cert = ssock.getpeercert()
                    return {"status": "SECURE", "ssl_valid": True, "issuer": dict(x[0] for x in cert['issuer']).get('organizationName')}
        except Exception as e:
            return {"status": "VULNERABLE", "ssl_valid": False, "reason": str(e)}

    def _analyze_social_integration(self, url):
        """Node 3: Scrape le DOM pour détecter l'intelligence sociale (WhatsApp, TikTok)."""
        print(f"[{datetime.now().strftime('%H:%M:%S')}] 🌍 Détection des intégrations des plateformes clés...")
        try:
            # Add a user-agent to avoid simple blocks
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
            response = requests.get(url, headers=headers, timeout=15)
            html_content = response.text.lower()
            
            has_whatsapp = "wa.me" in html_content or "api.whatsapp.com" in html_content
            has_tiktok = "tiktok.com" in html_content
            
            return {
                "whatsapp_integrated": has_whatsapp,
                "tiktok_integrated": has_tiktok,
                "status": "SUCCESS"
            }
        except Exception as e:
            return {"status": "ERROR", "reason": str(e)}

    def _calculate_business_impact(self, pagespeed, security, social):
        """Business Logic Engine: Traduit la dette technique en perte financière estimée."""
        annual_loss = 0
        frictions = []
        opportunity = []
        
        # 1. Performance Impact
        if pagespeed.get("status") == "SUCCESS":
            perf = pagespeed.get("performance_score", 100)
            if perf < 50:
                annual_loss += 5000  # Estimate in USD
                frictions.append("Vitesse critique : Perte de 50% des visiteurs avant chargement.")
                opportunity.append("Optimisation CDN et mise en cache stricte.")
            elif perf < 80:
                annual_loss += 2000
                frictions.append("Chargement lent : Impact négatif sur l'expérience utilisateur.")

        # 2. Security Impact
        if security.get("ssl_valid") is False:
            annual_loss += 10000
            frictions.append("Faille de sécurité : Absence de SSL/HTTPS. Blocage par les navigateurs.")
            opportunity.append("Installation immédiate d'un certificat de sécurité.")

        # 3. Social & Conversion Impact
        if social.get("status") == "SUCCESS":
            if not social.get("whatsapp_integrated"):
                annual_loss += 8000
                frictions.append("Tunnel de conversion brisé : Pas de contact direct WhatsApp.")
                opportunity.append("Intégration d'un agent conversationnel WhatsApp automatisé.")
            if not social.get("tiktok_integrated"):
                frictions.append("Déficit de visibilité : Aucune liaison avec l'écosystème viral TikTok.")

        # Cap minimum si rien ne marche
        if annual_loss == 0 and pagespeed.get("status") != "SUCCESS":
            annual_loss = 15000
            frictions.append("Site potentiellement inaccessible ou bloquant les audits d'autorité.")

        return {
            "annual_loss_usd": annual_loss,
            "frictions": frictions,
            "opportunities": opportunity,
            "recovery_potential": "95%" if annual_loss > 0 else "N/A"
        }

    def analyze_business(self, url):
        print(f"\n[{datetime.now().strftime('%H:%M:%S')}] 🚨 AGENTCY ENTERPRISE : DÉMARRAGE DE L'AUDIT DE {url}")
        
        if not url.startswith("http"):
            url = "https://" + url

        # Parallel/Sequential API Queries
        pagespeed_data = self._analyze_pagespeed(url)
        security_data = self._analyze_security_ssl(url)
        social_data = self._analyze_social_integration(url)
        
        # Compute Business Impact
        impact = self._calculate_business_impact(pagespeed_data, security_data, social_data)
        
        report = {
            "business_url": url,
            "timestamp": str(datetime.now()),
            "intelligence_nodes": {
                "google_pagespeed": pagespeed_data,
                "security_tls": security_data,
                "social_integration": social_data
            },
            "financial_impact": impact,
            "demo_link": "demo_template.html"
        }

        self.save_report(report)
        print(f"[{datetime.now().strftime('%H:%M:%S')}] ✅ Audit terminé. Rapport enregistré.")
        return report

    def save_report(self, report):
        try:
            with open(self.output_file, "r") as f:
                data = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            data = []
        data.append(report)
        with open(self.output_file, "w") as f:
            json.dump(data, f, indent=4)

if __name__ == "__main__":
    auditor = AgentAuditor()
    # Test avec un site gouvernemental ou grand public RDC
    auditor.analyze_business("https://www.vodacom.cd")
